import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * Self-contained ambient accent BEHIND the Features bento grid: a slow orbit of
 * accent (#e27533) connector nodes drifting around the section. Own transparent
 * <Canvas> (NOT the shared View/Port), absolute inset-0, pointer-events-none,
 * negative z-index so it sits behind the bento cards. Theme-aware, deliberately
 * faint — background ambience only; the existing DOM widgets stay untouched.
 *
 * Gate mounting on `useSceneEnabled()` at the call site — this file assumes it may run.
 *
 * ponytail: same Points/PointMaterial pattern as TestimonialsScene; ring positions
 * generated inline (annulus + z jitter). Swap in maath if you ever want curl noise.
 */
const ACCENT = '#e27533';

function ring(count: number, rInner: number, rOuter: number, depth: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const r = rInner + (rOuter - rInner) * Math.sqrt(Math.random());
    arr[i * 3] = r * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(theta);
    arr[i * 3 + 2] = (Math.random() - 0.5) * depth;
  }
  return arr;
}

interface LayerProps {
  count: number;
  rInner: number;
  rOuter: number;
  size: number;
  opacity: number;
  speed: number;
}

const NodeRing: React.FC<LayerProps> = ({ count, rInner, rOuter, size, opacity, speed }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => ring(count, rInner, rOuter, 0.6), [count, rInner, rOuter]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * speed; // slow in-plane orbit
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ACCENT}
        size={size}
        sizeAttenuation
        opacity={opacity}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </Points>
  );
};

const FeaturesScene: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}
      camera={{ position: [0, 0, 2.4], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      {/* Tilt the disk so the ring reads as an orbit in perspective */}
      <group rotation={[Math.PI / 3.5, 0, 0]}>
        <NodeRing count={520} rInner={1.15} rOuter={1.9} size={0.02} opacity={dark ? 0.5 : 0.32} speed={0.03} />
        <NodeRing count={220} rInner={0.7} rOuter={1.1} size={0.03} opacity={dark ? 0.4 : 0.24} speed={-0.045} />
      </group>
    </Canvas>
  );
};

export default FeaturesScene;
