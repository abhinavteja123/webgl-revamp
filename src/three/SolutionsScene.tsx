import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * Subtle 3D accent behind the Solutions tab content. Its central object swaps to
 * embody the active business model:
 *   0 Orchestrator      -> routing hub firing branching beams
 *   1 Merchant of Record-> sealed nested vault/ledger cube
 *   2 Facilitator       -> splitting particle fountain
 *   3 Gateway           -> tokenization tunnel (rings receding in depth)
 *
 * Self-contained transparent <Canvas>, absolutely positioned, pointer-events-none,
 * behind the card via negative z-index. Decorative only (aria-hidden). The parent
 * gates rendering on useSceneEnabled(), so this never mounts under reduced-motion /
 * low-tier devices — the existing SVG diagrams remain the fallback.
 */

const ACCENT = new THREE.Color('#e27533');

type RepProps = { color: THREE.Color };

// --- Rep 0: Orchestrator — routing hub firing branching beams -------------
function HubRep({ color }: RepProps) {
  const { beamGeo, nodeGeo } = useMemo(() => {
    const N = 6;
    const beams: number[] = [];
    const nodes: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 1.8;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.7;
      const z = Math.sin(a * 1.7) * 0.7;
      beams.push(0, 0, 0, x, y, z);
      nodes.push(x, y, z);
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(beams), 3));
    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodes), 3));
    return { beamGeo: bg, nodeGeo: ng };
  }, []);

  return (
    <group>
      <lineSegments geometry={beamGeo}>
        <lineBasicMaterial color={color} transparent />
      </lineSegments>
      <points geometry={nodeGeo}>
        <pointsMaterial color={color} size={0.16} transparent sizeAttenuation depthWrite={false} />
      </points>
      <mesh>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color={color} wireframe transparent />
      </mesh>
    </group>
  );
}

// --- Rep 1: Merchant of Record — sealed nested vault/ledger cube -----------
function VaultRep({ color }: RepProps) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color={color} wireframe transparent />
      </mesh>
      <mesh scale={0.55}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color={color} wireframe transparent />
      </mesh>
    </group>
  );
}

// --- Rep 2: Facilitator — splitting particle fountain ($100 -> 70/20/10) ---
function FountainRep({ color, active }: RepProps & { active: boolean }) {
  const M = 90;
  const { geo, dirs, phase, speed } = useMemo(() => {
    const positions = new Float32Array(M * 3);
    const dirs = new Float32Array(M * 3);
    const phase = new Float32Array(M);
    const speed = new Float32Array(M);
    for (let i = 0; i < M; i++) {
      const s = i % 3; // three split streams
      const ang = (s / 3) * Math.PI * 2 + 0.4;
      dirs[i * 3] = Math.cos(ang);
      dirs[i * 3 + 1] = 0;
      dirs[i * 3 + 2] = Math.sin(ang);
      phase[i] = Math.random();
      speed[i] = 0.3 + Math.random() * 0.35;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geo: g, dirs, phase, speed };
  }, []);

  useFrame((_, delta) => {
    if (!active) return; // skip work while faded out
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const spread = 1.0;
    for (let i = 0; i < M; i++) {
      phase[i] = (phase[i] + delta * speed[i]) % 1;
      const p = phase[i];
      arr[i * 3] = dirs[i * 3] * p * spread;
      arr[i * 3 + 1] = -1.0 + p * 2.2;
      arr[i * 3 + 2] = dirs[i * 3 + 2] * p * spread;
    }
    pos.needsUpdate = true;
  });

  return (
    <points geometry={geo}>
      <pointsMaterial color={color} size={0.09} transparent sizeAttenuation depthWrite={false} />
    </points>
  );
}

// --- Rep 3: Gateway — tokenization tunnel (rings receding in depth) --------
function TunnelRep({ color, active }: RepProps & { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const RINGS = 8;
  const ringGeo = useMemo(() => {
    const seg = 48;
    const positions = new Float32Array((seg + 1) * 3);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      positions[i * 3] = Math.cos(a);
      positions[i * 3 + 1] = Math.sin(a);
      positions[i * 3 + 2] = 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (!active || !group.current) return;
    for (const c of group.current.children) {
      c.position.z += delta * 1.4;
      if (c.position.z > 1.5) c.position.z -= RINGS;
      c.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: RINGS }).map((_, i) => (
        <lineLoop key={i} geometry={ringGeo} position={[0, 0, -6.5 + i]} scale={1.1}>
          <lineBasicMaterial color={color} transparent />
        </lineLoop>
      ))}
    </group>
  );
}

// --- Morph host: cross-fades the four reps by weight + opacity -------------
function Morph({
  activeTab,
  color,
  baseOpacity,
}: {
  activeTab: number;
  color: THREE.Color;
  baseOpacity: number;
}) {
  const root = useRef<THREE.Group>(null);
  const groupRefs = useRef<(THREE.Group | null)[]>([null, null, null, null]);
  const weights = useRef<number[]>([0, 0, 0, 0]);

  useFrame((_, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.12;
    for (let i = 0; i < 4; i++) {
      const target = i === activeTab ? 1 : 0;
      const w = THREE.MathUtils.damp(weights.current[i], target, 5, delta);
      weights.current[i] = w;
      const g = groupRefs.current[i];
      if (!g) continue;
      g.visible = w > 0.002;
      g.scale.setScalar(0.6 + 0.4 * w);
      g.traverse((o) => {
        const mat = (o as unknown as { material?: THREE.Material }).material;
        if (mat) {
          mat.transparent = true;
          mat.opacity = baseOpacity * w;
        }
      });
    }
  });

  const setRef = (i: number) => (el: THREE.Group | null) => {
    groupRefs.current[i] = el;
  };

  return (
    <group ref={root}>
      <group ref={setRef(0)}>
        <HubRep color={color} />
      </group>
      <group ref={setRef(1)}>
        <VaultRep color={color} />
      </group>
      <group ref={setRef(2)}>
        <FountainRep color={color} active={activeTab === 2} />
      </group>
      <group ref={setRef(3)}>
        <TunnelRep color={color} active={activeTab === 3} />
      </group>
    </group>
  );
}

const SolutionsScene: React.FC<{ activeTab: number }> = ({ activeTab }) => {
  const { theme } = useTheme();
  const baseOpacity = theme === 'dark' ? 0.8 : 0.5;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Morph activeTab={activeTab} color={ACCENT} baseOpacity={baseOpacity} />
      </Canvas>
    </div>
  );
};

export default SolutionsScene;
