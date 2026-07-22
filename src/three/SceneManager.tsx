import React from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';
import { useDeviceTier } from '../hooks/useDeviceTier';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Single shared WebGL context for the whole page.
 *
 * Sections render their 3D into a `<View track={ref} />` (from drei) that targets a DOM
 * element; this fixed full-viewport Canvas composites them all. One context instead of N.
 *
 * Returns null when the device tier is 'low' or reduced-motion is on — sections then show
 * their DOM fallback and never mount 3D. Gate every section on `useSceneEnabled()`.
 */
export function useSceneEnabled(): boolean {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  return tier === 'high' && !reduced;
}

export const SceneManager: React.FC = () => {
  const enabled = useSceneEnabled();
  if (!enabled) return null;

  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      {/* Sections attach their content via drei <View>; this composites them. */}
      <View.Port />
      <Preload all />
    </Canvas>
  );
};
