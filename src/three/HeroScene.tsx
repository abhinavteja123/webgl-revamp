import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * HeroScene — self-contained 3D "payment-routing network" that sits BEHIND the DOM Hero.
 *
 * A cloud of glowing instanced nodes connected by lines in depth, drifting slowly, with a
 * live packet travelling an edge and a bloom glow — all in the brand accent (#e27533).
 * Renders its own <Canvas> (absolute, fills the hero, pointer-events-none, low z). It is only
 * ever mounted when `useSceneEnabled()` is true, so this file never needs to know about the
 * reduced-motion / low-power / no-WebGL fallback — the existing DOM Hero is that fallback.
 *
 * This is the flagship pattern other sections copy: gate → lazy-load → self-contained canvas.
 */

const NODE_COUNT = 26;
const MAX_LINK_DIST = 3.2; // world units; pairs closer than this get an edge
const ACCENT = '#e27533';

type NodeData = {
  base: THREE.Vector3;   // home position
  phase: THREE.Vector3;  // per-axis drift phase
  speed: THREE.Vector3;  // per-axis drift speed
  amp: THREE.Vector3;    // per-axis drift amplitude
};

function buildNodes(): NodeData[] {
  // Deterministic-ish spread so the graph reads as a network, not a random blob.
  const nodes: NodeData[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const base = new THREE.Vector3(
      (Math.random() - 0.5) * 11,
      (Math.random() - 0.5) * 6.5,
      (Math.random() - 0.5) * 5 - 1.5,
    );
    nodes.push({
      base,
      phase: new THREE.Vector3(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
      speed: new THREE.Vector3(0.12 + Math.random() * 0.15, 0.1 + Math.random() * 0.15, 0.08 + Math.random() * 0.12),
      amp: new THREE.Vector3(0.35 + Math.random() * 0.3, 0.3 + Math.random() * 0.25, 0.25 + Math.random() * 0.25),
    });
  }
  return nodes;
}

function buildEdges(nodes: NodeData[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].base.distanceTo(nodes[j].base) < MAX_LINK_DIST) edges.push([i, j]);
    }
  }
  return edges;
}

const Network: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const nodes = useMemo(buildNodes, []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const packetRef = useRef<THREE.Mesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => nodes.map((n) => n.base.clone()), [nodes]);

  // Line vertex buffer: two vertices (2 * 3 floats) per edge, rewritten each frame.
  const lineArray = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges.length]);
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
    return g;
  }, [lineArray]);

  // A packet that flies one edge, then hops to the next — the "live transaction".
  const packet = useRef({ edge: 0, t: 0 });

  const accentColor = useMemo(() => {
    // meshBasicMaterial with toneMapped=false: push value past 1 so Bloom catches it.
    const c = new THREE.Color(ACCENT);
    c.multiplyScalar(isDark ? 2.2 : 1.35);
    return c;
  }, [isDark]);

  const lineColor = useMemo(() => new THREE.Color(ACCENT), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const mesh = meshRef.current;

    // Drift each node around its home position and write instance matrices.
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      positions[i].set(
        n.base.x + Math.sin(t * n.speed.x + n.phase.x) * n.amp.x,
        n.base.y + Math.sin(t * n.speed.y + n.phase.y) * n.amp.y,
        n.base.z + Math.sin(t * n.speed.z + n.phase.z) * n.amp.z,
      );
      if (mesh) {
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    }
    if (mesh) mesh.instanceMatrix.needsUpdate = true;

    // Rewrite edge line segments from the drifted node positions.
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      const o = e * 6;
      lineArray[o] = positions[a].x;
      lineArray[o + 1] = positions[a].y;
      lineArray[o + 2] = positions[a].z;
      lineArray[o + 3] = positions[b].x;
      lineArray[o + 4] = positions[b].y;
      lineArray[o + 5] = positions[b].z;
    }
    lineGeom.attributes.position.needsUpdate = true;

    // Advance the packet along its current edge; hop to a random edge on arrival.
    if (packetRef.current && edges.length) {
      const p = packet.current;
      p.t += delta * 0.45;
      if (p.t >= 1) {
        p.t = 0;
        p.edge = Math.floor(Math.random() * edges.length);
      }
      const [a, b] = edges[p.edge];
      packetRef.current.position.lerpVectors(positions[a], positions[b], p.t);
    }

    // Slow, subtle drift of the whole network.
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
  });

  // GSAP soft entrance: the network scales up gently on mount.
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    const tween = gsap.fromTo(
      g.scale,
      { x: 0.82, y: 0.82, z: 0.82 },
      { x: 1, y: 1, z: 1, duration: 1.6, ease: 'power2.out' },
    );
    return () => { tween.kill(); };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Glowing nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={accentColor} toneMapped={false} />
      </instancedMesh>

      {/* Connective edges */}
      <lineSegments geometry={lineGeom} frustumCulled={false}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={isDark ? 0.28 : 0.16}
          toneMapped={false}
        />
      </lineSegments>

      {/* Live transaction packet */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color={isDark ? '#ffd9b0' : ACCENT} toneMapped={false} />
      </mesh>
    </group>
  );
};

const HeroScene: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const wrapRef = useRef<HTMLDivElement>(null);

  // GSAP fade-in of the whole layer so it never pops in.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' });
    return () => { tween.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Network isDark={isDark} />
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={isDark ? 1.15 : 0.55}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default HeroScene;
