import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

function CabinetsModel(props: any) {
  const { scene } = useGLTF('/lowpoly_cabinets.glb');
  return <primitive object={scene} {...props} />;
}

export default function CabinetsExperiment() {
  return (
    <>
      <ambientLight intensity={0.8} color={'#ffffff'} />
      <pointLight position={[5, 10, 5]} intensity={1.2} color={'#ffffff'} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <CabinetsModel scale={1.5} />
      </Suspense>
    </>
  );
}
