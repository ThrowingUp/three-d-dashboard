'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ShaderMaterial, Color } from 'three';
import { useControls } from 'leva';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

// Define shader code
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uElevation;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uDensity;
  uniform float uLineWidth;
  uniform float uGlowStrength;

  // Function to create a wave pattern
  float wave(vec2 uv, float freq, float amp, float time, float phase) {
    float y = sin((uv.x * freq + time + phase) * 6.28318) * amp;
    float dist = abs(uv.y - 0.5 - y);
    return smoothstep(uLineWidth, uLineWidth * 0.5, dist);
  }

  void main() {
    vec2 uv = vUv;
    float waves = 0.0;
    
    // Create multiple waves with different frequencies and phases
    for (int i = 0; i < 5; i++) {
      float index = float(i) / 5.0;
      float freq = uFrequency * (1.0 + index * 0.5);
      float amp = uAmplitude * (0.5 + index * 0.1);
      float phase = index * 3.0;
      float density = uDensity * (1.0 + index * 0.2);
      
      waves += wave(uv, freq, amp, uTime * (0.5 + index * 0.1), phase) * 
               (0.8 - index * 0.15);
    }
    
    // Color gradient based on position
    vec3 color = mix(uColor, uSecondaryColor, uv.y + sin(uTime * 0.2) * 0.2);
    
    // Apply waves to color with glow
    vec3 finalColor = color * waves * uGlowStrength;
    
    // Output final color
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create shader material initialization
const createWaveMaterial = () => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(0x00ffff) },
      uSecondaryColor: { value: new Color(0x0033ff) },
      uFrequency: { value: 2.5 },
      uAmplitude: { value: 0.2 },
      uDensity: { value: 2.0 },
      uLineWidth: { value: 0.025 },
      uGlowStrength: { value: 2.0 }
    },
    transparent: true,
    depthWrite: false
  });
};

// Voeg props toe voor Leva defaults en key
type WaveGridProps = {
  levaDefaults?: any;
  levaKey?: string;
};

// Create the main WaveGrid component
export default function WaveGrid({ levaDefaults = {}, levaKey = 'wavegrid' }: WaveGridProps) {
  // Stable uniforms object
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uColor: { value: new Color(0x00ffff) },
    uSecondaryColor: { value: new Color(0x0033ff) },
    uFrequency: { value: 2.5 },
    uAmplitude: { value: 0.2 },
    uDensity: { value: 2.0 },
    uLineWidth: { value: 0.025 },
    uGlowStrength: { value: 2.0 }
  });
  // Create the material only once
  const waveMaterial = useRef<ShaderMaterial>(
    new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false
    })
  );

  // Define controls for interactive adjustment with merged defaults
  const controlsConfig: any = {
    color: '#00ffff',
    secondaryColor: '#0033ff',
    frequency: { value: 2.5, min: 0.1, max: 10, step: 0.1 },
    amplitude: { value: 0.2, min: 0.01, max: 0.4, step: 0.01 },
    density: { value: 2.0, min: 0.5, max: 10, step: 0.1 },
    lineWidth: { value: 0.025, min: 0.001, max: 0.1, step: 0.001 },
    glowStrength: { value: 2.0, min: 0.1, max: 10, step: 0.1 },
    bloomIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    bloomThreshold: { value: 0.1, min: 0, max: 1, step: 0.01 }
  };

  // Merge defaults with saved preset values
  const finalConfig = { ...controlsConfig };
  if (levaDefaults && Object.keys(levaDefaults).length > 0) {
    Object.keys(levaDefaults).forEach(key => {
      if (finalConfig[key]) {
        if (typeof finalConfig[key] === 'object' && 'value' in finalConfig[key]) {
          finalConfig[key] = { ...finalConfig[key], value: levaDefaults[key] };
        } else {
          finalConfig[key] = levaDefaults[key];
        }
      }
    });
  }

  const controls = useControls('Wave Grid', finalConfig) as any;

  // Update material uniforms when controls change
  useEffect(() => {
    uniformsRef.current.uColor.value.set(controls.color);
    uniformsRef.current.uSecondaryColor.value.set(controls.secondaryColor);
    uniformsRef.current.uFrequency.value = controls.frequency;
    uniformsRef.current.uAmplitude.value = controls.amplitude;
    uniformsRef.current.uDensity.value = controls.density;
    uniformsRef.current.uLineWidth.value = controls.lineWidth;
    uniformsRef.current.uGlowStrength.value = controls.glowStrength;
  }, [controls]);

  // Create a smooth looping animation
  useFrame(({ clock }) => {
    uniformsRef.current.uTime.value = clock.getElapsedTime() % 12;
  });

  return (
    <>
      <PerformanceMonitor />
      {/* Use a plane to render the wave pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} scale={20}>
        <planeGeometry args={[1, 1, 64, 64]} />
        {/* Attach the material via the material prop, not as a JSX tag */}
        <primitive object={waveMaterial.current} attach="material" />
      </mesh>
      
      {/* Add bloom effect for glow */}
      <EffectComposer>
        <Bloom 
          intensity={controls.bloomIntensity}
          luminanceThreshold={controls.bloomThreshold}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
