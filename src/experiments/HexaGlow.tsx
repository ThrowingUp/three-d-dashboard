'use client';

/**
 * HexaGlow Experiment
 *
 * Interactive animated hexagonal glowing grid using Three.js shaders and React Three Fiber.
 *
 * Features:
 * - Animated hex grid with glow, wave, and noise effects
 * - All parameters adjustable in real-time via Leva panel
 * - Bloom postprocessing for enhanced glow
 *
 * Controls:
 * - Color 1 & 2: Gradient colors for the grid
 * - Grid Size: Number of hexes per unit
 * - Line Width: Thickness of grid lines
 * - Glow Strength: Intensity of the glow
 * - Pulse Amount: Strength of pulsing animation
 * - Wave Amplitude/Frequency: Controls the 3D wave effect
 * - Noise Strength: Adds randomness to the grid
 * - Bloom Intensity/Threshold: Postprocessing glow
 *
 * @component
 * @example
 * <HexaGlow />
 */

// Optional: Export experiment meta data for dynamic loading or documentation
export const meta = {
  title: 'HexaGlow',
  slug: 'hexaglow',
  tags: ['shader', 'hexagon', 'glow', 'leva', 'threejs', 'r3f'],
  description: 'Animated glowing hexagonal grid with interactive controls and bloom effect.',
  created: '2025-07-13',
  author: 'Your Name',
};

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ShaderMaterial, Color, Vector3 } from 'three';
import { useControls, button, folder } from 'leva';

// Define shader code
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;

  void main() {
    vUv = uv;
    
    // Add subtle wave effect
    vec3 pos = position;
    float waveZ = sin(pos.x * uFrequency + uTime * 0.5) * 
                 cos(pos.y * uFrequency + uTime * 0.5) * uAmplitude;
    pos.z += waveZ;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uGridSize;
  uniform float uLineWidth;
  uniform float uGlowStrength;
  uniform float uPulse;
  uniform float uNoiseStrength;

  // Simple 2D pseudo-random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // Smooth interpolation
    vec2 u = smoothstep(0.0, 1.0, f);
    
    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  // Create hexagonal grid
  float hexGrid(vec2 p, float gridSize, float lineWidth) {
    p *= gridSize;
    
    // Hexagonal grid math
    vec2 h = vec2(1.0, 1.73205); // sqrt(3)
    vec2 a = mod(p, h) - h*0.5;
    vec2 b = mod(p + h*0.5, h) - h*0.5;
    
    // Distance to nearest hexagon edge
    float d = min(dot(a, a), dot(b, b));
    
    // Create lines with smooth edges
    float line = smoothstep(lineWidth, lineWidth * 0.5, sqrt(d));
    return line;
  }

  void main() {
    // Create a pulsing effect
    float pulse = 1.0 + sin(uTime * 0.5) * uPulse;
    
    // Add noise effect
    float n = noise(vUv * 10.0 + uTime * 0.1) * uNoiseStrength;
    
    // Create hexagonal grid
    float gridValue = hexGrid(vUv, uGridSize, uLineWidth + n * 0.01);
    
    // Color gradient based on position and time
    vec3 colorMix = mix(uColor1, uColor2, sin(vUv.y + uTime * 0.2) * 0.5 + 0.5);
    
    // Add glow effect
    vec3 color = colorMix * gridValue * pulse * uGlowStrength;
    
    // Output final color
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Create custom shader material
const HexGridMaterial = ShaderMaterial;

// Create shader material
const createHexGridMaterial = () => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new Color(0x00ffff) },
      uColor2: { value: new Color(0xff00ff) },
      uGridSize: { value: 6.0 },
      uLineWidth: { value: 0.03 },
      uGlowStrength: { value: 2.0 },
      uPulse: { value: 0.2 },
      uAmplitude: { value: 0.1 },
      uFrequency: { value: 2.0 },
      uNoiseStrength: { value: 0.2 }
    },
    transparent: true,
    depthWrite: false
  });
};

// Create the main HexaGlow component
export default function HexaGlow() {
  // Reference to material for animations
  const materialRef = useRef<any>(null);
  
  // Define controls for interactive adjustment (grouped, with descriptions and reset)
  const controls = useControls(
    {
      'Hexa Glow': folder({
        color1: {
          value: '#00ffff',
          label: 'Color 1',
          description: 'First color of the grid gradient.'
        },
        color2: {
          value: '#ff00ff',
          label: 'Color 2',
          description: 'Second color of the grid gradient.'
        },
        gridSize: {
          value: 6, min: 1, max: 20, step: 0.5,
          label: 'Grid Size',
          description: 'Number of hexes per unit.'
        },
        lineWidth: {
          value: 0.03, min: 0.001, max: 0.1, step: 0.001,
          label: 'Line Width',
          description: 'Thickness of the grid lines.'
        },
        glowStrength: {
          value: 2.0, min: 0.1, max: 10, step: 0.1,
          label: 'Glow Strength',
          description: 'Intensity of the glow effect.'
        },
        pulseAmount: {
          value: 0.2, min: 0, max: 1, step: 0.01,
          label: 'Pulse Amount',
          description: 'Strength of the pulsing animation.'
        },
        waveAmplitude: {
          value: 0.1, min: 0, max: 0.5, step: 0.01,
          label: 'Wave Amplitude',
          description: 'Amplitude of the 3D wave effect.'
        },
        waveFrequency: {
          value: 2.0, min: 0.1, max: 10, step: 0.1,
          label: 'Wave Frequency',
          description: 'Frequency of the 3D wave effect.'
        },
        noiseStrength: {
          value: 0.2, min: 0, max: 1, step: 0.01,
          label: 'Noise Strength',
          description: 'Randomness in the grid lines.'
        },
        bloomIntensity: {
          value: 1.8, min: 0, max: 3, step: 0.1,
          label: 'Bloom Intensity',
          description: 'Strength of the bloom postprocessing.'
        },
        bloomThreshold: {
          value: 0.2, min: 0, max: 1, step: 0.01,
          label: 'Bloom Threshold',
          description: 'Threshold for bloom effect.'
        },
        // Reset button
        Reset: button(() => window.location.reload()),
      }, { collapsed: false })
    }
  );

  // Update material uniforms when controls change
  useEffect(() => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.uColor1.value.set(controls.color1);
    materialRef.current.uniforms.uColor2.value.set(controls.color2);
    materialRef.current.uniforms.uGridSize.value = controls.gridSize;
    materialRef.current.uniforms.uLineWidth.value = controls.lineWidth;
    materialRef.current.uniforms.uGlowStrength.value = controls.glowStrength;
    materialRef.current.uniforms.uPulse.value = controls.pulseAmount;
    materialRef.current.uniforms.uAmplitude.value = controls.waveAmplitude;
    materialRef.current.uniforms.uFrequency.value = controls.waveFrequency;
    materialRef.current.uniforms.uNoiseStrength.value = controls.noiseStrength;
  }, [controls]);

  // Create a smooth looping animation
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    
    // Make the animation loop every 15 seconds
    const time = clock.getElapsedTime();
    const loopTime = time % 15;
    materialRef.current.uniforms.uTime.value = loopTime;
  });

  return (
    <>
      {/* Use a plane to render the grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} scale={20}>
        <planeGeometry args={[1, 1, 128, 128]} />
        <shaderMaterial 
          ref={materialRef}
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new Color(controls.color1) },
            uColor2: { value: new Color(controls.color2) },
            uGridSize: { value: controls.gridSize },
            uLineWidth: { value: controls.lineWidth },
            uGlowStrength: { value: controls.glowStrength },
            uPulse: { value: controls.pulseAmount },
            uAmplitude: { value: controls.waveAmplitude },
            uFrequency: { value: controls.waveFrequency },
            uNoiseStrength: { value: controls.noiseStrength }
          }}
          transparent
          depthWrite={false}
        />
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
