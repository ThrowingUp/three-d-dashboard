import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { EffectComposer, Bloom, SMAA, ToneMapping } from '@react-three/postprocessing';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function UniverseScene() {
  
  // Leva parameters uitbreiden
  const { orbitRadius, rotationSpeed, planetTexture, electronTexture } = useControls({
    orbitRadius: { value: 5, min: 1, max: 10 },
    rotationSpeed: { value: 0.005, min: 0.001, max: 0.01 },
    planetTexture: {
      value: '/2k_earth_daymap.jpg',
      options: {
        Earth: '/2k_earth_daymap.jpg',
        Mars: '/2k_mars.jpg',
        Jupiter: '/2k_jupiter.jpg',
        None: '',
      },
      label: 'Planet Texture',
    },
    electronTexture: {
      value: '',
      options: {
        None: '',
        Moon: '/2k_moon.jpg',
        Metal: '/metal.jpg',
      },
      label: 'Electron Texture',
    },
  });

  // Textures altijd via useTexture aanroepen, maar alleen als er een geldig pad is (anders undefined)
  const planetMap = planetTexture && planetTexture !== '' ? useTexture(planetTexture) : undefined;
  const electronMap = electronTexture && electronTexture !== '' ? useTexture(electronTexture) : undefined;

  // Hoofdobject referentie
  const coreRef = useRef(null);
  // Hoeken voor de orbiting objects
  const angles = useRef(Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2));

  // Refs voor orbiting objects
  const orbitRefs = useRef<any[]>([]);
  // Set a simple envMap (fake reflection) using a color for all MeshStandardMaterial in the scene
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((obj: any) => {
      if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
        // Create a simple cube texture with a solid color
        const size = 1;
        const data = new Uint8Array([200, 220, 255, 255, 255, 255, 200, 220, 255]);
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
        texture.needsUpdate = true;
        obj.material.envMap = texture;
        obj.material.envMapIntensity = 0.7;
        obj.material.needsUpdate = true;
      }
    });
  }, []);

  // Elektronen in 3D-baan (x/z ipv x/y)
  useFrame(() => {
    if (coreRef.current) {
      (coreRef.current as any).rotation.y += 0.003;
    }
    orbitRefs.current.forEach((mesh, i) => {
      if (mesh) {
        angles.current[i] += rotationSpeed;
        // 3D cirkelbaan: x/z ipv x/y
        mesh.position.x = Math.cos(angles.current[i]) * orbitRadius;
        mesh.position.z = Math.sin(angles.current[i]) * orbitRadius;
        mesh.position.y = 0; // optioneel: alles in 1 vlak
      }
    });
  });

  return (
    <group ref={sceneRef}>
      {/* Physically correct lighting */}
      {/* Ambient light (soft global illumination) */}
      <ambientLight intensity={0.5} color={0x404040} />
      {/* Directional light for strong highlights */}
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1}
        color={0xffffff}
        castShadow
      />
      {/* Optional: Point light for extra effect */}
      <pointLight position={[10, 10, 10]} intensity={0.5} color={0xffffff} />
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color={planetTexture ? undefined : 0x0044ff} 
          roughness={0.3} 
          metalness={0.5} 
          map={planetMap}
        />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={el => (orbitRefs.current[i] = el)}
          position={[
            Math.cos(angles.current[i]) * orbitRadius,
            Math.sin(angles.current[i]) * orbitRadius,
            0,
          ]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={electronTexture ? undefined : 0xffcc00} 
            roughness={0.6} 
            metalness={0.3} 
            map={electronMap}
          />
        </mesh>
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.7} />
        <SMAA />
        <ToneMapping />
      </EffectComposer>
      <OrbitControls enableDamping enableZoom={false} />
    </group>
  );
}

export default UniverseScene;
