import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface CardProps {
  progressRef: React.MutableRefObject<number>;
}

const CyberneticCard: React.FC<CardProps> = ({ progressRef }) => {
  const cardGroupRef = useRef<THREE.Group>(null);
  const cardBaseRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { mouse } = useThree();

  // Create rounded rectangle geometry for the credit card shape
  const cardGeometry = useMemo(() => {
    const width = 2.0;
    const height = 1.25;
    const radius = 0.08;
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

    const extrudeSettings = {
      steps: 1,
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.005,
      bevelSegments: 4
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Circuit trace coordinates (relative to card face)
  const circuitLines = useMemo(() => {
    return [
      // Outer border trace
      [
        new THREE.Vector3(-0.95, -0.58, 0.022),
        new THREE.Vector3(0.95, -0.58, 0.022),
        new THREE.Vector3(0.95, 0.58, 0.022),
        new THREE.Vector3(-0.95, 0.58, 0.022),
        new THREE.Vector3(-0.95, -0.58, 0.022),
      ],
      // Connecting traces from EMV chip
      [
        new THREE.Vector3(-0.55, 0.15, 0.022),
        new THREE.Vector3(-0.35, 0.35, 0.022),
        new THREE.Vector3(0.6, 0.35, 0.022),
      ],
      [
        new THREE.Vector3(-0.55, -0.15, 0.022),
        new THREE.Vector3(-0.35, -0.35, 0.022),
        new THREE.Vector3(0.1, -0.35, 0.022),
        new THREE.Vector3(0.2, -0.25, 0.022),
      ],
      [
        new THREE.Vector3(-0.35, 0.0, 0.022),
        new THREE.Vector3(0.5, 0.0, 0.022),
      ]
    ];
  }, []);

  useFrame((state) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.elapsedTime;
    const p = progressRef.current;

    // Interactive mouse tilt + auto bobbing
    if (p < 0.8) {
      const targetRotationY = (mouse.x * 0.45) + Math.sin(time * 0.8) * 0.05;
      const targetRotationX = -(mouse.y * 0.3) + Math.cos(time * 0.6) * 0.05;
      
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(cardGroupRef.current.rotation.y, targetRotationY, 0.08);
      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, targetRotationX, 0.08);
      
      // Floating Z depth bobbing
      cardGroupRef.current.position.z = Math.sin(time * 1.5) * 0.05;
    } else {
      // Warp split / Zoom into screen: align card flat and charge z-axis forward
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(cardGroupRef.current.rotation.y, 0, 0.15);
      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, 0, 0.15);
      
      // Fly the card past the camera
      cardGroupRef.current.position.z = (p - 0.8) * 20.0;
    }

    // EMV chip pulse glow
    if (chipRef.current) {
      const chipMat = chipRef.current.material as THREE.MeshBasicMaterial;
      chipMat.color.setHSL(0.06, 0.9, 0.45 + Math.sin(time * 6.0) * 0.15);
    }
  });

  return (
    <group ref={cardGroupRef}>
      {/* 3D Credit Card Body */}
      <mesh ref={cardBaseRef} geometry={cardGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#0b0b0c"
          roughness={0.2}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
        />
      </mesh>

      {/* EMV Microchip */}
      <mesh ref={chipRef} position={[-0.55, 0, 0.02]}>
        <planeGeometry args={[0.3, 0.26]} />
        <meshBasicMaterial color="#e27533" />
      </mesh>

      {/* Holographic Glowing Circuit Lines */}
      {circuitLines.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color="#e27533"
          lineWidth={1.5}
          transparent
          opacity={0.8}
        />
      ))}

      {/* Brand Text Engraved on the Card */}
      <Text
        position={[0.1, 0.12, 0.021]}
        fontSize={0.13}
        fontWeight="bold"
        font="/Outfit-Bold.ttf"
        anchorX="left"
        anchorY="middle"
        color="#ffffff"
      >
        better
      </Text>

      <Text
        position={[0.1, -0.05, 0.021]}
        fontSize={0.13}
        fontWeight="bold"
        font="/Outfit-Bold.ttf"
        anchorX="left"
        anchorY="middle"
        color="#e27533"
      >
        switch
      </Text>

      {/* Simulated Premium Hologram Label */}
      <mesh position={[0.65, -0.38, 0.02]}>
        <planeGeometry args={[0.25, 0.16]} />
        <meshPhysicalMaterial
          color="#a1a1a1"
          metalness={1.0}
          roughness={0.05}
          clearcoat={1.0}
          iridescence={1.0}
          iridescenceIOR={1.8}
        />
      </mesh>
    </group>
  );
};

interface CurtainContentProps {
  onComplete: () => void;
}

const CurtainContent: React.FC<CurtainContentProps> = ({ onComplete }) => {
  const progress = useRef(0);
  const lightRef = useRef<THREE.PointLight>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const opacity = useRef({ bg: 1 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate point light around the card for reflection highlights
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 1.5) * 2.0;
      lightRef.current.position.y = Math.cos(time * 1.2) * 1.5;
    }
  });

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // 0.0s - 1.6s: Let user hover and interact with the floating card
    tl.to({}, { duration: 1.6 });

    // 1.6s - 2.5s: Align card, charge forward, and fade the black background curtain
    tl.to(progress, {
      current: 1.0,
      duration: 0.9,
      ease: 'power3.inOut'
    });

    // Fade the solid background opacity to reveal the page behind the flyby
    tl.to(opacity.current, {
      bg: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, '>-0.4');

  }, [onComplete]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={lightRef} position={[2, 2, 2.5]} intensity={4.5} color="#e27533" />
      <spotLight
        ref={spotlightRef}
        position={[0, 4, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-2, -2, 1]} intensity={0.5} color="#454550" />
      
      {/* 3D Cybernetic Card */}
      <CyberneticCard progressRef={progress} />

      {/* Ambient background glow behind the card */}
      <mesh position={[0, 0, -2.0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          color="#e27533"
          transparent
          opacity={0.035 * (1.0 - progress.current)}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

interface CurtainSceneProps {
  onComplete: () => void;
}

const CurtainScene: React.FC<CurtainSceneProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100vw', height: '100vh' }}
      >
        <CurtainContent onComplete={onComplete} />
      </Canvas>
    </div>
  );
};

export default CurtainScene;
