import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const PARTICLE_COUNT = 620;

function generateBoxOutlinePoints(count: number, w: number, h: number, d: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const edges = 12;
  const pointsPerEdge = Math.floor(count / edges);

  let idx = 0;
  const addSegment = (p1: [number, number, number], p2: [number, number, number], num: number) => {
    for (let i = 0; i < num; i++) {
      if (idx >= count) break;
      const t = Math.random();
      arr[idx * 3] = p1[0] + (p2[0] - p1[0]) * t;
      arr[idx * 3 + 1] = p1[1] + (p2[1] - p1[1]) * t;
      arr[idx * 3 + 2] = p1[2] + (p2[2] - p1[2]) * t;
      idx++;
    }
  };

  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  // Bottom 4 edges
  addSegment([-hw, -hh, -hd], [-hw, -hh, hd], pointsPerEdge);
  addSegment([hw, -hh, -hd], [hw, -hh, hd], pointsPerEdge);
  addSegment([-hw, -hh, -hd], [hw, -hh, -hd], pointsPerEdge);
  addSegment([-hw, -hh, hd], [hw, -hh, hd], pointsPerEdge);

  // Top 4 edges
  addSegment([-hw, hh, -hd], [-hw, hh, hd], pointsPerEdge);
  addSegment([hw, hh, -hd], [hw, hh, hd], pointsPerEdge);
  addSegment([-hw, hh, -hd], [hw, hh, -hd], pointsPerEdge);
  addSegment([-hw, hh, hd], [hw, hh, hd], pointsPerEdge);

  // Vertical 4 edges
  addSegment([-hw, -hh, -hd], [-hw, hh, -hd], pointsPerEdge);
  addSegment([hw, -hh, -hd], [hw, hh, -hd], pointsPerEdge);
  addSegment([-hw, -hh, hd], [-hw, hh, -hd], pointsPerEdge);
  addSegment([hw, -hh, hd], [hw, hh, hd], pointsPerEdge);

  // Fill remaining
  while (idx < count) {
    arr[idx * 3] = (Math.random() - 0.5) * w;
    arr[idx * 3 + 1] = (Math.random() - 0.5) * h;
    arr[idx * 3 + 2] = (Math.random() - 0.5) * d;
    idx++;
  }

  return arr;
}

const AssemblingParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Size of the pricing card in 3D coordinates
  const cardWidth = 2.4;
  const cardHeight = 3.6;
  const cardDepth = 0.4;

  const [initial, target] = useMemo(() => {
    const initialArr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Dispersed in a wide random sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 3.5 + Math.random() * 2.5;

      initialArr[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      initialArr[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      initialArr[i * 3 + 2] = dist * Math.cos(phi);
    }

    const targetArr = generateBoxOutlinePoints(PARTICLE_COUNT, cardWidth, cardHeight, cardDepth);
    return [initialArr, targetArr];
  }, []);

  // Set initial positions into the float array
  const currentPositions = useMemo(() => new Float32Array(initial), [initial]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;

    const time = state.clock.elapsedTime;
    // Assemble over 2.6 seconds
    const progress = Math.min(1.0, time / 2.6);
    const t = 1 - Math.pow(1 - progress, 3.5); // Quintic-like ease out

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const tx = target[i3];
      const ty = target[i3 + 1];
      const tz = target[i3 + 2];

      const ix = initial[i3];
      const iy = initial[i3 + 1];
      const iz = initial[i3 + 2];

      let cx = ix + (tx - ix) * t;
      let cy = iy + (ty - iy) * t;
      let cz = iz + (tz - iz) * t;

      if (progress >= 1.0) {
        // slow hover drifting wave
        const wave = Math.sin(time * 0.8 + i * 0.15) * 0.015;
        cx += wave;
        cy += wave;
        cz += wave;
      }

      posAttr.setXYZ(i, cx, cy, cz);
    }
    posAttr.needsUpdate = true;

    // Slowly rotate the assembled bounding cage
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={currentPositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e27533"
        size={0.038}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
};

const PricingScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <AssemblingParticles />
      </Canvas>
    </div>
  );
};

export default PricingScene;
