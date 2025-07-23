'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePerformanceStore, PerformanceData } from '@/lib/performance-store';
import Stats from 'stats.js';

export function usePerformanceMonitor() {
  const { gl, scene, camera } = useThree();
  const { addDataPoint, isRecording } = usePerformanceStore();
  const statsRef = useRef<Stats | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  const lastUpdateRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const fpsBufferRef = useRef<number[]>([]);
  const frameTimeBufferRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  
  // Initialize stats.js
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '10px';
    stats.dom.style.right = '10px';
    stats.dom.style.zIndex = '100';
    stats.dom.style.display = showStats ? 'block' : 'none';
    
    document.body.appendChild(stats.dom);
    statsRef.current = stats;
    
    return () => {
      if (stats.dom.parentNode) {
        document.body.removeChild(stats.dom);
      }
    };
  }, []);
  
  // Update stats visibility
  useEffect(() => {
    if (statsRef.current) {
      statsRef.current.dom.style.display = showStats ? 'block' : 'none';
    }
  }, [showStats]);
  
  // Performance monitoring
  useFrame(() => {
    if (!isRecording) return;
    
    const now = performance.now();
    const frameDelta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    
    // Calculate instantaneous FPS and frame time
    const instantFps = 1000 / frameDelta;
    
    // Add to buffers for smoothing
    fpsBufferRef.current.push(instantFps);
    frameTimeBufferRef.current.push(frameDelta);
    
    // Keep buffer size reasonable (60 frames = ~1 second at 60fps)
    if (fpsBufferRef.current.length > 60) {
      fpsBufferRef.current.shift();
    }
    if (frameTimeBufferRef.current.length > 60) {
      frameTimeBufferRef.current.shift();
    }
    
    frameCountRef.current++;
    
    // Update performance data every 10 frames (~6 times per second at 60fps) for smoother updates
    if (frameCountRef.current % 10 === 0) {
      if (statsRef.current) {
        statsRef.current.begin();
      }
      
      // Calculate smoothed averages
      const avgFps = fpsBufferRef.current.reduce((a, b) => a + b, 0) / fpsBufferRef.current.length;
      const avgFrameTime = frameTimeBufferRef.current.reduce((a, b) => a + b, 0) / frameTimeBufferRef.current.length;
      
      // Collect performance data
      const info = gl.info;
      
      const performanceData: PerformanceData = {
        fps: Math.round(avgFps),
        frameTime: Math.round(avgFrameTime * 10) / 10, // Round to 1 decimal place
        drawCalls: info.render.calls,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        memoryUsage: {
          geometries: info.memory.geometries,
          textures: info.memory.textures,
          programs: info.programs?.length || 0,
          total: info.memory.geometries + info.memory.textures,
        },
        gpuLoad: 0, // Placeholder - would need WebGL extensions for real GPU load
        visibleMeshes: countVisibleMeshes(scene),
        triangles: info.render.triangles || 0,
        timestamp: Date.now(),
      };

      addDataPoint(performanceData);
      
      if (statsRef.current) {
        statsRef.current.end();
      }
    }
  });
  
  const countVisibleMeshes = (object: any): number => {
    let count = 0;
    object.traverse((child: any) => {
      if (child.isMesh && child.visible) {
        count++;
      }
    });
    return count;
  };
  
  const toggleStats = () => setShowStats(!showStats);
  
  const exportLogs = () => {
    const data = usePerformanceStore.getState().data;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threejs-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return {
    toggleStats,
    showStats,
    exportLogs,
  };
}
