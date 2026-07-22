import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

function getRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

interface GlassCardProps {
  width: number;
  height: number;
  radius: number;
  isDark: boolean;
  position: [number, number, number];
  floatSpeed: number;
  floatIntensity: number;
  children?: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({
  width,
  height,
  radius,
  isDark,
  position,
  floatSpeed,
  floatIntensity,
  children
}) => {
  const shape = useMemo(() => getRoundedRectShape(width, height, radius), [width, height, radius]);
  const borderPoints = useMemo(() => {
    return shape.getPoints(50).map(p => new THREE.Vector3(p.x, p.y, 0));
  }, [shape]);

  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cardRef.current) return;
    const time = state.clock.elapsedTime;
    // subtle individual floating offsets
    cardRef.current.position.y = position[1] + Math.sin(time * floatSpeed) * 0.05 * floatIntensity;
    cardRef.current.position.x = position[0] + Math.cos(time * floatSpeed * 0.7) * 0.02 * floatIntensity;
  });

  return (
    <group ref={cardRef} position={[position[0], position[1], position[2]]}>
      {/* Glass card panel face */}
      <mesh castShadow receiveShadow>
        <shapeGeometry args={[shape]} />
        <meshPhysicalMaterial
          transparent
          opacity={isDark ? 0.08 : 0.45}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={0.5}
          color={isDark ? '#1C1C20' : '#FFFFFF'}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Glass card border outline */}
      <Line
        points={borderPoints}
        color={isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}
        lineWidth={1.2}
      />

      {children}
    </group>
  );
};

const DashboardContent: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const containerRef = useRef<THREE.Group>(null);

  // Mouse tilt control for the entire viewport
  useFrame((state) => {
    if (!containerRef.current) return;
    const targetX = (state.pointer.x * Math.PI) / 12;
    const targetY = (state.pointer.y * Math.PI) / 12;

    containerRef.current.rotation.x = THREE.MathUtils.lerp(containerRef.current.rotation.x, -targetY, 0.05);
    containerRef.current.rotation.y = THREE.MathUtils.lerp(containerRef.current.rotation.y, targetX, 0.05);
  });

  // Glowing Line Chart Points for Card 1
  const lineChartPoints = useMemo(() => {
    const points = [];
    const rawData = [
      -0.8, -0.6, -0.2, 0.3, 0.1, 0.5, 0.2, 0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 0.95
    ];
    const segmentWidth = 3.0 / (rawData.length - 1);
    for (let i = 0; i < rawData.length; i++) {
      const x = -1.5 + i * segmentWidth;
      const y = -0.4 + rawData[i] * 0.8;
      points.push(new THREE.Vector3(x, y, 0.02));
    }
    return points;
  }, []);

  const donutGeometry = useMemo(() => new THREE.RingGeometry(0.3, 0.42, 32), []);

  return (
    <group ref={containerRef}>
      {/* 1. Main observability panel */}
      <GlassCard
        width={3.6}
        height={2.2}
        radius={0.12}
        isDark={isDark}
        position={[0, 0.2, 0]}
        floatSpeed={0.8}
        floatIntensity={0.8}
      >
        {/* Card Header Title */}
        <Text
          position={[-1.5, 0.8, 0.02]}
          fontSize={0.08}
          font="/Outfit-Regular.ttf"
          color={isDark ? '#94A3B8' : '#64748B'}
          anchorX="left"
        >
          TOTAL REVENUE (REAL-TIME)
        </Text>
        <Text
          position={[-1.5, 0.62, 0.02]}
          fontSize={0.18}
          fontWeight="bold"
          font="/Outfit-Bold.ttf"
          color={isDark ? '#FFFFFF' : '#0F172A'}
          anchorX="left"
        >
          $124,500.00
        </Text>

        {/* Chart Lines */}
        <Line
          points={lineChartPoints}
          color="#e27533"
          lineWidth={2.5}
        />
        {/* Helper dots */}
        {lineChartPoints.map((pt, index) => (
          <mesh key={index} position={[pt.x, pt.y, pt.z + 0.005]}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshBasicMaterial color="#e27533" />
          </mesh>
        ))}

        {/* Ambient Glowing Plane below the chart */}
        <mesh position={[0, -0.4, 0.005]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 0.4]} />
          <meshBasicMaterial
            color="#e27533"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </GlassCard>

      {/* 2. Offset Widget Card (Method Split) */}
      <GlassCard
        width={1.9}
        height={1.3}
        radius={0.1}
        isDark={isDark}
        position={[-1.9, -0.6, 0.35]}
        floatSpeed={1.2}
        floatIntensity={1.0}
      >
        <Text
          position={[-0.75, 0.45, 0.02]}
          fontSize={0.08}
          font="/Outfit-Regular.ttf"
          color={isDark ? '#94A3B8' : '#64748B'}
          anchorX="left"
        >
          Method Split
        </Text>
        <Text
          position={[-0.75, 0.31, 0.02]}
          fontSize={0.13}
          fontWeight="bold"
          font="/Outfit-Bold.ttf"
          color={isDark ? '#FFFFFF' : '#0F172A'}
          anchorX="left"
        >
          $10.2M
        </Text>

        {/* Mini donut chart */}
        <group position={[0, -0.22, 0.02]}>
          {/* Base Ring */}
          <mesh geometry={donutGeometry}>
            <meshBasicMaterial color={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} />
          </mesh>
          {/* Main Segment */}
          <mesh geometry={donutGeometry} rotation={[0, 0, -Math.PI / 4]}>
            <meshBasicMaterial color="#e27533" transparent opacity={0.88} />
          </mesh>
          {/* Sub Segment */}
          <mesh geometry={donutGeometry} rotation={[0, 0, Math.PI / 2]}>
            <meshBasicMaterial color="#14B8A6" transparent opacity={0.88} />
          </mesh>
        </group>
      </GlassCard>

      {/* 3. Offset Widget Card (Success Rate) */}
      <GlassCard
        width={1.9}
        height={1.3}
        radius={0.1}
        isDark={isDark}
        position={[1.9, -0.5, 0.45]}
        floatSpeed={0.9}
        floatIntensity={1.2}
      >
        <Text
          position={[-0.75, 0.45, 0.02]}
          fontSize={0.08}
          font="/Outfit-Regular.ttf"
          color={isDark ? '#94A3B8' : '#64748B'}
          anchorX="left"
        >
          Success Rate
        </Text>
        <Text
          position={[-0.75, 0.3, 0.02]}
          fontSize={0.16}
          fontWeight="bold"
          font="/Outfit-Bold.ttf"
          color="#10B981"
          anchorX="left"
        >
          99.9%
        </Text>

        {/* Simulated activity pulse graph */}
        <group position={[0, -0.2, 0.02]}>
          {Array.from({ length: 9 }).map((_, idx) => {
            const h = 0.12 + Math.sin(idx * 1.5) * 0.18;
            return (
              <mesh key={idx} position={[-0.6 + idx * 0.15, 0, 0]}>
                <boxGeometry args={[0.08, h, 0.01]} />
                <meshBasicMaterial color={idx === 8 ? '#e27533' : '#10B981'} transparent opacity={0.8} />
              </mesh>
            );
          })}
        </group>
      </GlassCard>
    </group>
  );
};

const DashboardScene: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'auto', background: 'transparent' }}
      >
        <ambientLight intensity={isDark ? 0.8 : 1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />
        <DashboardContent isDark={isDark} />
      </Canvas>
    </div>
  );
};

export default DashboardScene;
