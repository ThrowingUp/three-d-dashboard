'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';
import { UniformsLib, ShaderLib, ShaderMaterial, Color } from 'three';
import { useControls } from 'leva';

// Define shader code
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;

  void main() {
    vUv = uv;
    
    // Add subtle wave effect to the grid
    vec3 pos = position;
    float waveX = sin(pos.x * uFrequency + uTime) * uAmplitude;
    float waveY = sin(pos.y * uFrequency + uTime) * uAmplitude;
    pos.z += waveX + waveY;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform float uDualColor;
  uniform float uGridSize;
  uniform float uLineWidth;
  uniform float uGlowStrength;
  uniform float uPulse;

  // Function to create grid lines
  float grid(vec2 uv, float size, float lineWidth) {
    vec2 grid = fract(uv * size);
    
    // Create lines with antialiasing
    float lineX = smoothstep(0.0, lineWidth, grid.x) * 
                  smoothstep(lineWidth * 2.0, lineWidth, grid.x);
    float lineY = smoothstep(0.0, lineWidth, grid.y) * 
                  smoothstep(lineWidth * 2.0, lineWidth, grid.y);
                  
    // Combine horizontal and vertical lines
    return max(lineX, lineY);
  }

  void main() {
    // Create a pulsing effect
    float pulse = 1.0 + sin(uTime) * uPulse;
    
    // Create base grid
    float gridValue = grid(vUv, uGridSize, uLineWidth);
    
    // Mix colors based on dual color mode
    vec3 finalColor = uColor;
    if (uDualColor > 0.5) {
      float colorMix = sin(vUv.x * 6.28318 + uTime) * 0.5 + 0.5;
      finalColor = mix(uColor, uSecondaryColor, colorMix);
    }
    
    // Add glow effect
    vec3 color = finalColor * gridValue * pulse * uGlowStrength;
    
    // Output final color
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Create shader material initialization
const createGridMaterial = () => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(0x00ffff) },
      uSecondaryColor: { value: new Color(0xff0066) },
      uDualColor: { value: 0.0 },
      uGridSize: { value: 10.0 },
      uLineWidth: { value: 0.02 },
      uGlowStrength: { value: 2.0 },
      uPulse: { value: 0.2 },
      uAmplitude: { value: 0.05 },
      uFrequency: { value: 3.0 }
    },
    transparent: true,
    depthWrite: false
  });
};

// Create the main GlowGrid component
export default function GlowGrid() {
  // Reference to material for animations
  const materialRef = useRef<any>(null);
  
  // Define controls for interactive adjustment
  const controls = useControls('Glow Grid', {
    // Visual Settings
    color: '#00ffff',
    secondaryColor: { value: '#ff0066', render: (get) => get('enableDualColor') },
    enableDualColor: false,
    
    // Grid Settings
    gridSize: { value: 10, min: 1, max: 50, step: 1 },
    lineWidth: { value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
    
    // Animation Settings
    animationSpeed: { value: 1.0, min: 0.1, max: 5.0, step: 0.1 },
    pulseAmount: { value: 0.2, min: 0, max: 1, step: 0.01 },
    waveAmplitude: { value: 0.05, min: 0, max: 0.2, step: 0.01 },
    waveFrequency: { value: 3.0, min: 0.1, max: 10, step: 0.1 },
    
    // Glow Effects
    glowStrength: { value: 2.0, min: 0.1, max: 10, step: 0.1 },
    innerGlow: { value: 1.0, min: 0, max: 3, step: 0.1 },
    outerGlow: { value: 0.5, min: 0, max: 2, step: 0.1 },
    
    // Post-processing
    bloomIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    bloomThreshold: { value: 0.1, min: 0, max: 1, step: 0.01 },
    bloomRadius: { value: 0.4, min: 0.1, max: 1, step: 0.01 },
    
    // Advanced Settings
    wireframe: false,
    transparent: { value: true },
    opacity: { value: 0.8, min: 0.1, max: 1, step: 0.01, render: (get) => get('transparent') },
    depthTest: true,
    depthWrite: false
  });

  // Additional settings for GlowGrid experiment
  const settings = useControls({
    gridIntensity: { value: 1, min: 0, max: 5 },
    gridSize: { value: 10, min: 5, max: 20 },
  });

  // Listen for save events from RightSidebar
  useEffect(() => {
    const handleSave = (event: CustomEvent) => {
      if (event.detail.experiment === 'glowgrid') {
        const preset = {
          timestamp: new Date().toISOString(),
          controls: { ...controls },
          experimentId: 'glowgrid'
        };
        
        // Save to localStorage
        localStorage.setItem('glowgrid-preset', JSON.stringify(preset));
        console.log('Glowgrid preset saved:', preset);
        
        // You could also send to an API endpoint here
        // await fetch('/api/save-preset', { method: 'POST', body: JSON.stringify(preset) });
      }
    };

    window.addEventListener('leva-save', handleSave as EventListener);
    return () => window.removeEventListener('leva-save', handleSave as EventListener);
  }, [controls]);

  // Load preset on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('glowgrid-preset');
      if (saved) {
        const preset = JSON.parse(saved);
        console.log('Loaded glowgrid preset:', preset);
        // Note: Leva doesn't have a built-in way to programmatically set values
        // You'd need to implement a custom solution or use Leva's store API
      }
    } catch (error) {
      console.warn('Failed to load glowgrid preset:', error);
    }
  }, []);

  // Update material uniforms when controls change
  useEffect(() => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.uColor.value.set(controls.color);
    materialRef.current.uniforms.uSecondaryColor.value.set(controls.secondaryColor);
    materialRef.current.uniforms.uDualColor.value = controls.enableDualColor ? 1.0 : 0.0;
    materialRef.current.uniforms.uGridSize.value = controls.gridSize;
    materialRef.current.uniforms.uLineWidth.value = controls.lineWidth;
    materialRef.current.uniforms.uGlowStrength.value = controls.glowStrength;
    materialRef.current.uniforms.uPulse.value = controls.pulseAmount;
    materialRef.current.uniforms.uAmplitude.value = controls.waveAmplitude;
    materialRef.current.uniforms.uFrequency.value = controls.waveFrequency;
    
    // Update material properties
    materialRef.current.transparent = controls.transparent;
    materialRef.current.opacity = controls.opacity;
    materialRef.current.wireframe = controls.wireframe;
    materialRef.current.depthTest = controls.depthTest;
    materialRef.current.depthWrite = controls.depthWrite;
    materialRef.current.needsUpdate = true;
  }, [controls]);

  // Create a smooth looping animation
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * controls.animationSpeed;
    
    // Make the animation loop every 10 seconds
    const time = clock.getElapsedTime();
    const loopTime = time % 10;
    materialRef.current.uniforms.uTime.value = loopTime;
  });

  return (
    <>
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* Use a plane to render the grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} scale={20}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <shaderMaterial 
          ref={materialRef}
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={materialRef.current ? materialRef.current.uniforms : {
            uTime: { value: 0 },
            uColor: { value: new Color(controls.color) },
            uSecondaryColor: { value: new Color(controls.secondaryColor) },
            uDualColor: { value: controls.enableDualColor ? 1.0 : 0.0 },
            uGridSize: { value: controls.gridSize },
            uLineWidth: { value: controls.lineWidth },
            uGlowStrength: { value: controls.glowStrength },
            uPulse: { value: controls.pulseAmount },
            uAmplitude: { value: controls.waveAmplitude },
            uFrequency: { value: controls.waveFrequency }
          }}
          transparent={controls.transparent}
          opacity={controls.opacity}
          wireframe={controls.wireframe}
          depthTest={controls.depthTest}
          depthWrite={controls.depthWrite}
        />
      </mesh>
      
      {/* Add bloom effect for glow */}
      <EffectComposer>
        <Bloom 
          intensity={controls.bloomIntensity}
          luminanceThreshold={controls.bloomThreshold}
          radius={controls.bloomRadius}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

