import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'low';

/**
 * Coarse capability gate. 'low' → render DOM/CSS fallback instead of WebGL.
 * Heuristic: no WebGL, few cores, small viewport, or coarse pointer → low.
 */
function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low';

  // No WebGL at all → definitely low.
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'low';
  } catch {
    return 'low';
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 700;

  if (cores <= 4 && coarse && smallViewport) return 'low';
  return 'high';
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high');

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return tier;
}
