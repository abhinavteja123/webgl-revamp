import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { partnerLogos } from '../lib/constants';

const LOGO_NAMES = ['dodopayments', 'VAULTERA', 'PesaSwap', 'paycode'];

function drawLogoToCanvas(name: string, isDark: boolean, isHovered: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set colors based on hover and theme
  const textColor = isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)';
  const accentColor = name === 'dodopayments' ? '#FF6B35' :
                      name === 'VAULTERA' ? '#3B82F6' :
                      name === 'PesaSwap' ? '#10B981' : '#F59E0B';

  const strokeColor = isHovered ? accentColor : textColor;
  const fillTextColor = isHovered ? (isDark ? '#FFFFFF' : '#0B0B0B') : textColor;

  ctx.save();
  ctx.translate(45, 64); // Center of icon

  ctx.fillStyle = strokeColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const scale = 2.4;
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);

  if (name === 'dodopayments') {
    // Top rhombus
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(2, 7);
    ctx.lineTo(12, 12);
    ctx.lineTo(22, 7);
    ctx.closePath();
    ctx.stroke();

    // Middle segment
    ctx.beginPath();
    ctx.moveTo(2, 12);
    ctx.lineTo(12, 17);
    ctx.lineTo(22, 12);
    ctx.stroke();

    // Bottom segment
    ctx.beginPath();
    ctx.moveTo(2, 17);
    ctx.lineTo(12, 22);
    ctx.lineTo(22, 17);
    ctx.stroke();
  } else if (name === 'VAULTERA') {
    // Shield/box
    ctx.beginPath();
    ctx.roundRect(3, 11, 18, 11, 2);
    ctx.stroke();
    // Lock shackle
    ctx.beginPath();
    ctx.moveTo(7, 11);
    ctx.lineTo(7, 7);
    ctx.arcTo(7, 2, 12, 2, 5);
    ctx.arcTo(17, 2, 17, 7, 5);
    ctx.lineTo(17, 11);
    ctx.stroke();
  } else if (name === 'PesaSwap') {
    // Right arrow
    ctx.beginPath();
    ctx.moveTo(17, 1);
    ctx.lineTo(21, 5);
    ctx.lineTo(17, 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, 11);
    ctx.lineTo(3, 9);
    ctx.arcTo(3, 5, 7, 5, 4);
    ctx.lineTo(21, 5);
    ctx.stroke();

    // Left arrow
    ctx.beginPath();
    ctx.moveTo(7, 23);
    ctx.lineTo(3, 19);
    ctx.lineTo(7, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 13);
    ctx.lineTo(21, 15);
    ctx.arcTo(21, 19, 17, 19, 4);
    ctx.lineTo(3, 19);
    ctx.stroke();
  } else {
    // Code tags for paycode
    ctx.beginPath();
    ctx.moveTo(16, 18);
    ctx.lineTo(22, 12);
    ctx.lineTo(16, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, 6);
    ctx.lineTo(2, 12);
    ctx.lineTo(8, 18);
    ctx.stroke();
  }
  ctx.restore();

  // Draw Text
  ctx.fillStyle = fillTextColor;
  ctx.font = name === 'paycode'
    ? 'bold 44px JetBrains Mono, monospace'
    : name === 'VAULTERA'
    ? '900 42px Outfit, sans-serif'
    : 'bold 42px Figtree, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  let textLabel = name;
  if (name === 'dodopayments') textLabel = 'dodo payments';
  ctx.fillText(textLabel, 115, 64);

  return canvas;
}

interface BillboardLogoProps {
  name: string;
  angle: number;
  radius: number;
  isDark: boolean;
  onHoverStateChange: (hovered: boolean) => void;
}

const BillboardLogo: React.FC<BillboardLogoProps> = ({ name, angle, radius, isDark, onHoverStateChange }) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);

  // Generate textures for normal and hover states
  const textures = useMemo(() => {
    const normalCanvas = drawLogoToCanvas(name, isDark, false);
    const hoverCanvas = drawLogoToCanvas(name, isDark, true);
    
    const normalTex = new THREE.CanvasTexture(normalCanvas);
    const hoverTex = new THREE.CanvasTexture(hoverCanvas);
    
    normalTex.colorSpace = THREE.SRGBColorSpace;
    hoverTex.colorSpace = THREE.SRGBColorSpace;

    return { normal: normalTex, hover: hoverTex };
  }, [name, isDark]);

  useEffect(() => {
    return () => {
      textures.normal.dispose();
      textures.hover.dispose();
    };
  }, [textures]);

  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (!groupRef.current || !materialRef.current) return;

    // Calculate current coordinates based on group rotation
    const parentRotation = groupRef.current.parent ? groupRef.current.parent.rotation.y : 0;
    const currentAngle = angle + parentRotation;

    // Positional arrangement
    groupRef.current.position.x = radius * Math.sin(currentAngle);
    groupRef.current.position.z = radius * Math.cos(currentAngle);

    // Dynamic depth fading based on Z position (fog emulation)
    const z = groupRef.current.position.z;
    const normalizedDepth = (z - (-radius)) / (2 * radius); // 0 at front (Z=radius), 1 at back (Z=-radius)
    const opacity = Math.max(0.04, 1.0 - normalizedDepth * 0.9);
    materialRef.current.opacity = opacity;

    // Smooth hover scaling
    targetScale.current = hovered ? 1.25 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale.current * 1.5, targetScale.current * 0.375, 1), 0.1);

    // Swap textures smoothly
    materialRef.current.map = hovered ? textures.hover : textures.normal;
  });

  return (
    <Billboard
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverStateChange(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHoverStateChange(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh>
        <planeGeometry args={[1.5, 0.375]} />
        <meshBasicMaterial
          ref={materialRef}
          map={textures.normal}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
};

const Ring: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const groupRef = useRef<THREE.Group>(null);
  
  const [hoveredCount, setHoveredCount] = useState(0);
  const isAnyHovered = hoveredCount > 0;

  const radius = 2.5;
  const logoCount = 8; // Repeating the 4 logos to make 8 nodes

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Rotate ring slowly, slowing down or stopping on hover
    const targetSpeed = isAnyHovered ? 0.03 : 0.15;
    groupRef.current.rotation.y -= delta * targetSpeed;
  });

  const handleHoverState = (isHovered: boolean) => {
    setHoveredCount(prev => isHovered ? prev + 1 : Math.max(0, prev - 1));
  };

  return (
    <group ref={groupRef}>
      {Array.from({ length: logoCount }).map((_, i) => {
        const name = LOGO_NAMES[i % LOGO_NAMES.length];
        const angle = (i * 2 * Math.PI) / logoCount;
        return (
          <BillboardLogo
            key={i}
            name={name}
            angle={angle}
            radius={radius}
            isDark={isDark}
            onHoverStateChange={handleHoverState}
          />
        );
      })}
    </group>
  );
};

const LogosScene: React.FC = () => {
  return (
    <div className="w-full h-32 md:h-36 relative z-10 select-none">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <Ring />
      </Canvas>
    </div>
  );
};

export default LogosScene;
