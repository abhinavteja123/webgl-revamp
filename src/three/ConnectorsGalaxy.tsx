import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * Decorative WebGL hero for the Connectors page — a slow-rotating "galaxy" of
 * accent-colored nodes on a Fibonacci sphere. Self-contained <Canvas>; its own
 * bounded, pointer-events-enabled panel that sits ABOVE the page content and
 * never overlaps the filter/search/grid. Purely presentational: it does NOT
 * read the connectors data or affect filtering.
 *
 * ponytail: Fibonacci sphere is hand-rolled (~8 lines) instead of pulling in
 * maath's random.onSphere — even distribution, zero import-path risk, more
 * reliable than texturing 135 SVG billboards. Add billboards if a 1:1 logo
 * showcase is ever required.
 */

/** Even points on a sphere shell (golden-angle spiral) with slight radial jitter for volume. */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const jitter = 0.82 + Math.random() * 0.36;
    positions[i * 3] = Math.cos(theta) * r * radius * jitter;
    positions[i * 3 + 1] = y * radius * jitter;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius * jitter;
  }
  return positions;
}

const Galaxy: React.FC<{ hubColor: string }> = ({ hubColor }) => {
  const shell = useMemo(() => fibonacciSphere(720, 2.3), []);
  const hubs = useMemo(() => fibonacciSphere(64, 2.35), []);

  return (
    <>
      {/* Dense accent shell — the "200+ connectors" cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shell, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e27533"
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Sparse brighter "hub" nodes for depth */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[hubs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={hubColor}
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
};

const ConnectorsGalaxy: React.FC = () => {
  const { theme } = useTheme();
  // ponytail: additive glow only reads on a dark backdrop, so the panel is dark
  // in both themes; theme only nudges the hub tint + ambient glow.
  const hubColor = theme === 'dark' ? '#ffffff' : '#ffe6d2';

  return (
    <div className="relative w-full h-52 sm:h-60 md:h-72 mb-8 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-[#0B0B0B] to-[#161616] select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Galaxy hubColor={hubColor} />
      </Canvas>
      {/* Ambient accent glow (CSS, non-interactive) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(226,117,51,0.14),transparent_70%)]"
      />
    </div>
  );
};

export default ConnectorsGalaxy;
