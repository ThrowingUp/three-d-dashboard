'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';
import { useControls } from 'leva';

export default function BasicCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { rotationSpeed } = useControls({
    rotationSpeed: { value: 0.5, min: 0.1, max: 2 },
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed;
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
