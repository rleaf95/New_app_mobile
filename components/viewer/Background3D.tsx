import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as THREE from 'three';

// 3D背景の設定コンポーネント
function BackgroundScene() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.background = new THREE.Color('rgba(122, 148, 171, 1)');
    return () => {
      scene.background = null;
    };
  }, [scene]);
  
  return null;
}

// ガラス状の3Dオブジェクトコンポーネント
interface GlassShapeProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: { x: number; y: number; z: number };
  geometryType: 'box' | 'tetrahedron' | 'icosahedron' | 'octahedron';
}

function GlassShape({ position, scale, rotationSpeed, geometryType }: GlassShapeProps) {
  const ref = useRef<THREE.Mesh>(null!);
  
  const initialPosition = useRef(position);
  const moveSpeed = useRef({
    x: (Math.random() - 0.5) * 0.7,
    y: (Math.random() - 0.5) * 0.7,
    z: (Math.random() - 0.5) * 0.7,
  });
  const moveRange = useRef({
    x: Math.random() * 3 + 2,
    y: Math.random() * 3 + 2,
    z: Math.random() * 2 + 1,
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed.x * delta;
      ref.current.rotation.y += rotationSpeed.y * delta;
      ref.current.rotation.z += rotationSpeed.z * delta;
      
      const time = state.clock.elapsedTime;
      ref.current.position.x = initialPosition.current[0] + 
        Math.sin(time * moveSpeed.current.x) * moveRange.current.x;
      ref.current.position.y = initialPosition.current[1] + 
        Math.sin(time * moveSpeed.current.y) * moveRange.current.y;
      ref.current.position.z = initialPosition.current[2] + 
        Math.sin(time * moveSpeed.current.z) * moveRange.current.z;
    }
  });

  const materialProps = {
    color: '#E2E8F0',
    transparent: true,
    opacity: 0.15,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 0.8,
  };

  const GeometryComponent = () => {
    switch (geometryType) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <GeometryComponent />
      <meshPhysicalMaterial {...materialProps} />
    </mesh>
  );
}

// 小さな光る点のコンポーネント
function GlowingDots() {
  const dotsData = [];
  
  for (let i = 0; i < 15; i++) {
    dotsData.push({
      key: i,
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8 - 3,
      ] as [number, number, number],
      scale: Math.random() * 0.05 + 0.02,
    });
  }

  return (
    <>
      {dotsData.map((dot) => (
        <mesh key={dot.key} position={dot.position} scale={dot.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color="#60A5FA" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </>
  );
}

// 3D背景全体のコンポーネント
export function Background3D() {
  const shapesData: (GlassShapeProps & { key: number })[] = [];
  const geometryTypes: ('box' | 'tetrahedron' | 'icosahedron' | 'octahedron')[] = 
    ['box', 'tetrahedron', 'icosahedron', 'octahedron'];

  for (let i = 0; i < 25; i++) {
    shapesData.push({
      key: i,
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 6 - 4,
      ],
      scale: Math.random() * 0.8 + 0.3,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.5) * 0.15,
        z: (Math.random() - 0.5) * 0.15,
      },
      geometryType: geometryTypes[Math.floor(Math.random() * geometryTypes.length)],
    });
  }

  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 60 }} 
      gl={{ alpha: false, antialias: true }}
      style={StyleSheet.absoluteFillObject}
    >
      <BackgroundScene />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#60A5FA" />
      
      {shapesData.map((data) => (
        <GlassShape
          key={data.key}
          position={data.position}
          scale={data.scale}
          rotationSpeed={data.rotationSpeed}
          geometryType={data.geometryType}
        />
      ))}
      
      <GlowingDots />
    </Canvas>
  );
}
