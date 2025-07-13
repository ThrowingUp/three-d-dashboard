'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

export default function FloatingCubes() {
  const groupRef = useRef<Group>(null);
  const cubeRefs = useRef<Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    cubeRefs.current.forEach((cube, i) => {
      if (cube) {
        cube.position.y = Math.sin(time + i) * 2;
        cube.rotation.x = time + i;
        cube.rotation.y = time * 0.5 + i;
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
  });

  const cubes = Array.from({ length: 5 }, (_, i) => (
    <mesh
      key={i}
      ref={(el) => {
        if (el) cubeRefs.current[i] = el;
      }}
      position={[
        Math.cos((i / 5) * Math.PI * 2) * 3,
        0,
        Math.sin((i / 5) * Math.PI * 2) * 3
      ]}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color={`hsl(${(i / 5) * 360}, 70%, 60%)`}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  ));

  return (
    <>
      <PerformanceMonitor />
      <group ref={groupRef}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff6b6b" />
        
        {cubes}
      </group>
    </>
  );
}
