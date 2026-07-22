import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Self-contained obsidian starfield that sits BEHIND the Testimonials carousel.
 *
 * A slow-drifting 3D point cloud with depth (sizeAttenuation) and a faint accent
 * (#e27533) glow layer. Its own `<Canvas>` (transparent), pointer-events-none,
 * absolute — it does NOT touch the shared SceneManager View/Port. Calm, premium,
 * non-distracting: additive-blended points, very slow rotation.
 *
 * ponytail: positions generated inline (uniform-in-sphere). Swap in maath's
 * `inSphere` if you want curl-noise / fibonacci distribution later.
 */
function sphere(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

interface LayerProps {
  count: number;
  radius: number;
  color: string;
  size: number;
  opacity: number;
  speed: number;
}

const StarLayer: React.FC<LayerProps> = ({ count, radius, color, size, opacity, speed }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => sphere(count, radius), [count, radius]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.4;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const TestimonialsScene: React.FC = () => (
  <Canvas
    className="pointer-events-none"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    camera={{ position: [0, 0, 2.4], fov: 60 }}
    dpr={[1, 1.75]}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <group rotation={[0, 0, Math.PI / 5]}>
      <StarLayer count={4200} radius={1.6} color="#ffffff" size={0.012} opacity={0.85} speed={0.015} />
      <StarLayer count={900} radius={1.25} color="#e27533" size={0.02} opacity={0.5} speed={0.025} />
    </group>
  </Canvas>
);

export default TestimonialsScene;
