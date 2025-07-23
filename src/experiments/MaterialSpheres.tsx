'use client';

import { Sphere, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

function FloatingSphere({ position, color, speed, size, roughness }: { 
  position: [number, number, number]; 
  color: string; 
  speed: number;
  size: number;
  roughness: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.3}
          roughness={roughness}
        />
      </Sphere>
    </Float>
  );
}

export default function MaterialSpheres() {
  const { sphereSize, materialRoughness } = useControls({
    sphereSize: { value: 1, min: 0.5, max: 3 },
    materialRoughness: { value: 0.5, min: 0, max: 1 },
  });

  const spheres = useMemo(() => [
    { position: [-2, 0, 0] as [number, number, number], color: '#ef4444', speed: 1 },
    { position: [0, 0, 0] as [number, number, number], color: '#10b981', speed: 1.5 },
    { position: [2, 0, 0] as [number, number, number], color: '#3b82f6', speed: 0.8 },
    { position: [-1, 2, -1] as [number, number, number], color: '#f59e0b', speed: 1.2 },
    { position: [1, 2, -1] as [number, number, number], color: '#8b5cf6', speed: 0.9 },
  ], []);

  return (
    <>
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[10, -10, -10]} intensity={0.5} color="#ef4444" />
      
      {spheres.map((sphere, index) => (
        <FloatingSphere 
          key={index}
          position={sphere.position}
          color={sphere.color}
          speed={sphere.speed}
          size={sphereSize}
          roughness={materialRoughness}
        />
      ))}
    </>
  );
}
