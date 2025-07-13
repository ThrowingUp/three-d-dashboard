'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

export default function BasicCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <PerformanceMonitor />
      <Box ref={meshRef} args={[1, 1, 1]}>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
    </>
  );
}
