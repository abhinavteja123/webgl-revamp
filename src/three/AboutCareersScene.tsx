import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const NODE_COUNT = 32;
const ACCENT = '#e27533';

type SphereNode = {
  pos: THREE.Vector3;
  phase: number;
  speed: number;
};

// Generate nodes distributed on a sphere (Fibonacci sphere algorithm)
function buildSphereNodes(): SphereNode[] {
  const nodes: SphereNode[] = [];
  const offset = 2 / NODE_COUNT;
  const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    // Radius of the network sphere
    const radius = 1.35;
    nodes.push({
      pos: new THREE.Vector3(x * radius, y * radius, z * radius),
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.4
    });
  }
  return nodes;
}

function buildEdges(nodes: SphereNode[]): [number, number][] {
  const edges: [number, number][] = [];
  // Connect nodes if they are within a certain distance
  const threshold = 0.95;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].pos.distanceTo(nodes[j].pos) < threshold) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

const GlobalNetwork: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const nodes = useMemo(buildSphereNodes, []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const lineArray = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges.length]);
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
    return g;
  }, [lineArray]);

  const accentColor = useMemo(() => {
    const c = new THREE.Color(ACCENT);
    c.multiplyScalar(isDark ? 2.5 : 1.3);
    return c;
  }, [isDark]);

  const lineColor = useMemo(() => {
    const c = new THREE.Color(ACCENT);
    c.multiplyScalar(isDark ? 0.8 : 0.5);
    return c;
  }, [isDark]);

  // Track 4 flying packets
  const packets = useRef(
    Array.from({ length: 4 }).map(() => ({
      edgeIndex: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.4
    }))
  );

  const packetGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Slow overall rotation + tilt to mouse pointer
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (state.pointer.y * Math.PI) / 8, 0.05);
    }

    // Node updates (breathing displacement in sphere space)
    const currentPositions: THREE.Vector3[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const disp = 1.0 + Math.sin(t * n.speed + n.phase) * 0.035;
      
      const px = n.pos.x * disp;
      const py = n.pos.y * disp;
      const pz = n.pos.z * disp;
      currentPositions.push(new THREE.Vector3(px, py, pz));

      // Draw node instanced meshes
      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(0.045);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;

    // Link updates (regenerating positions in dynamic array buffer)
    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      const p1 = currentPositions[u];
      const p2 = currentPositions[v];

      const i6 = i * 6;
      lineArray[i6] = p1.x;
      lineArray[i6 + 1] = p1.y;
      lineArray[i6 + 2] = p1.z;
      lineArray[i6 + 3] = p2.x;
      lineArray[i6 + 4] = p2.y;
      lineArray[i6 + 5] = p2.z;
    }
    lineGeom.getAttribute('position').needsUpdate = true;

    // Packets updates
    if (packetGroupRef.current && packetGroupRef.current.children.length === packets.current.length) {
      for (let i = 0; i < packets.current.length; i++) {
        const p = packets.current[i];
        p.t += delta * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edgeIndex = Math.floor(Math.random() * edges.length);
          p.speed = 0.35 + Math.random() * 0.4;
        }

        const edge = edges[p.edgeIndex];
        if (edge) {
          const p1 = currentPositions[edge[0]];
          const p2 = currentPositions[edge[1]];
          const mesh = packetGroupRef.current.children[i] as THREE.Mesh;
          mesh.position.lerpVectors(p1, p2, p.t);
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      <instancedMesh ref={meshRef} args={[null as any, null as any, NODE_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={accentColor} toneMapped={false} />
      </instancedMesh>

      {/* Connection Links */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color={lineColor} transparent opacity={0.65} linewidth={1} />
      </lineSegments>

      {/* Traveling transaction packet meshes */}
      <group ref={packetGroupRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const AboutCareersScene: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-none select-none min-h-[280px]">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={isDark ? 0.7 : 1.1} />
        <GlobalNetwork isDark={isDark} />
        {isDark && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} height={300} intensity={1.1} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default AboutCareersScene;
