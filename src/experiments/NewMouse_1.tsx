// MouseFollowGlow.tsx
// React Three Fiber: Mouse-following light with bloom, dark theme, and color burst effect

import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
// @ts-expect-error: No types for @react-three/postprocessing
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useControls } from 'leva';

/**
 * Mouse-following glowing sphere with bloom and color burst effect.
 * Uses React Three Fiber and Drei for idiomatic integration.
 */
function MouseFollowGlow() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera, mouse } = useThree();
  const [colorLerp, setColorLerp] = useState(1);
  const targetColor = new THREE.Color(0x00fff0);
  const white = new THREE.Color(0xffffff);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const settings = useControls({
    glowIntensity: { value: 1, min: 0, max: 5 },
    followSpeed: { value: 0.5, min: 0.1, max: 2 },
  });

  // Animate sphere and light to follow mouse, and handle color burst
  useFrame(() => {
    // Only update color burst if mouse moved
    if (mouse.x !== lastMouse.current.x || mouse.y !== lastMouse.current.y) {
      setColorLerp(0);
      lastMouse.current = { x: mouse.x, y: mouse.y };
    } else {
      setColorLerp((prev) => Math.min(prev + 0.04, 1));
    }
    // Project mouse to a plane in front of the camera (z = 0)
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera);
    // Offset the sphere a bit away from the camera (e.g., along camera's forward direction)
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    vector.add(cameraDir.multiplyScalar(8)); // 2 units in front of the plane
    if (sphereRef.current) {
      sphereRef.current.position.lerp(vector, 0.18);
      const lerped = white.clone().lerp(targetColor, colorLerp);
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(lerped);
      mat.emissive.copy(lerped);
    }
    if (lightRef.current && sphereRef.current) {
      lightRef.current.position.copy(sphereRef.current.position);
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial;
      lightRef.current.color.copy(mat.color);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      {/* Ambient light for subtle fill */}
      <ambientLight color={0x222233} intensity={0.7} />
      {/* Main sphere (glow object) */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffffff}
          emissiveIntensity={1.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Mouse-following light */}
      <pointLight ref={lightRef} color={0xffffff} intensity={2} distance={20} />
      {/* Bloom postprocessing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.8} intensity={2.2} />
      </EffectComposer>
    </>
  );
}

export default MouseFollowGlow;
