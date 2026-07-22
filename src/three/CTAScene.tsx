import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';

/**
 * Self-contained "launch" beat behind the CTA section: transaction dots stream upward and
 * converge into a soft narrowing trail. Own <Canvas> (NOT the shared View/Port), absolute,
 * pointer-events-none, rendered behind the centered CTA content. Accent #e27533, theme-aware.
 *
 * Gate mounting on `useSceneEnabled()` at the call site — this file assumes it's allowed to run.
 */

const ACCENT = '#e27533';
const COUNT = 150;
const BOTTOM = -3.4;
const TOP = 3.4;
const SPAWN_WIDTH = 7;
const SPAWN_DEPTH = 2.4;

const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const vertexShader = /* glsl */ `
  uniform float uSize;
  attribute float aAlpha;
  attribute float aScale;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float mask = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, mask * vAlpha * uOpacity);
  }
`;

const Particles: React.FC<{ dark: boolean }> = ({ dark }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const intensity = useRef(0); // scroll-driven 0..1; floored so it never fully disappears
  const darkRef = useRef(dark);
  darkRef.current = dark;

  const { positions, alphas, scales, velocities, baseAlpha } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const alphas = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    const velocities = new Float32Array(COUNT);
    const baseAlpha = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPAWN_WIDTH;
      positions[i * 3 + 1] = BOTTOM + Math.random() * (TOP - BOTTOM);
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPAWN_DEPTH;
      scales[i] = 0.6 + Math.random() * 0.9;
      velocities[i] = 0.45 + Math.random() * 0.85;
      baseAlpha[i] = 0.5 + Math.random() * 0.5;
      alphas[i] = 0;
    }
    return { positions, alphas, scales, velocities, baseAlpha };
  }, []);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ACCENT) },
      uOpacity: { value: dark ? 0.9 : 0.5 },
      uSize: { value: 0.32 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Optional gentle scroll tie-in: ramp the plume up as the CTA section enters view.
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const trigger = gl.domElement.closest('section') ?? gl.domElement.parentElement;
    if (!trigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger,
      start: 'top bottom',
      end: 'center center',
      onUpdate: (self) => {
        intensity.current = self.progress;
      },
    });
    return () => st.kill();
  }, [gl]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    const mat = matRef.current;
    if (!points || !mat) return;
    const dt = Math.min(delta, 0.05);

    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const alphaAttr = points.geometry.attributes.aAlpha as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const alpha = alphaAttr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      let x = pos[ix];
      let y = pos[ix + 1];

      y += velocities[i] * dt;
      x += -x * 0.35 * dt; // converge toward center as it rises → narrowing trail

      if (y > TOP) {
        y = BOTTOM;
        x = (Math.random() - 0.5) * SPAWN_WIDTH;
        pos[ix + 2] = (Math.random() - 0.5) * SPAWN_DEPTH;
      }

      pos[ix] = x;
      pos[ix + 1] = y;

      const fade = smoothstep(BOTTOM, BOTTOM + 1.2, y) * (1 - smoothstep(TOP - 1.6, TOP, y));
      alpha[i] = fade * baseAlpha[i];
    }
    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;

    // Floor keeps it visible even if ScrollTrigger hasn't updated yet; ramps to full in view.
    const target = (darkRef.current ? 0.9 : 0.5) * (0.45 + 0.55 * intensity.current);
    mat.uniforms.uOpacity.value += (target - mat.uniforms.uOpacity.value) * Math.min(1, dt * 3);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

const CTAScene: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Particles dark={theme === 'dark'} />
    </Canvas>
  );
};

export default CTAScene;
