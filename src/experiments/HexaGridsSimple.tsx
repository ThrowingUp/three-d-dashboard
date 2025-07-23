'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useControls } from 'leva';

export default function HexaGrids() {
  const meshRef = useRef<Mesh>(null);

  const settings = useControls({
    gridSize: { value: 10, min: 5, max: 20 },
    gridSpacing: { value: 1, min: 0.5, max: 2 },
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#3b82f6" wireframe />
      </mesh>
    </group>
  );
}
