'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { usePerformanceStore } from './performance-store';

export function PerformanceMonitor() {
  const { gl, scene } = useThree();
  const performanceStore = usePerformanceStore();
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(60);

  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    
    // Update FPS every 60 frames
    if (frameCountRef.current % 60 === 0) {
      const deltaTime = currentTime - lastTimeRef.current;
      fpsRef.current = Math.round(60000 / deltaTime);
      lastTimeRef.current = currentTime;
      
      // Get renderer info
      const info = gl.info;
      
      // Calculate memory usage
      const memoryUsage = {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        total: info.memory.geometries + info.memory.textures,
      };
      
      // Count visible meshes
      let visibleMeshes = 0;
      let triangles = 0;
      
      scene.traverse((object: any) => {
        if (object.isMesh && object.visible) {
          visibleMeshes++;
          if (object.geometry) {
            const geometry = object.geometry;
            if (geometry.index) {
              triangles += geometry.index.count / 3;
            } else if (geometry.attributes.position) {
              triangles += geometry.attributes.position.count / 3;
            }
          }
        }
      });
      
      // Update performance store
      performanceStore.setCurrentData({
        fps: fpsRef.current,
        frameTime: parseFloat((deltaTime / 60).toFixed(1)),
        drawCalls: info.render.calls,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        memoryUsage,
        gpuLoad: 0, // This would need WebGL extension to get real GPU load
        visibleMeshes,
        triangles: Math.round(triangles),
        timestamp: currentTime,
      });
    }
  });

  return null; // This component doesn't render anything
}
