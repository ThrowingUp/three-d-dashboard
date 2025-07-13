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
    
    if (statsRef.current) {
      statsRef.current.begin();
    }
    
    // Collect performance data
    const info = gl.info;
    const memory = (performance as any).memory;
    
    const performanceData: PerformanceData = {
      fps: Math.round(1 / (performance.now() - (window as any).lastTime || 16) * 1000) || 60,
      frameTime: performance.now() - ((window as any).lastTime || performance.now()),
      drawCalls: info.render.calls,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs?.length || 0,
      memoryUsage: {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
      },
      gpuLoad: 0, // Placeholder - would need WebGL extensions for real GPU load
      visibleMeshes: countVisibleMeshes(scene),
      timestamp: Date.now(),
    };
    
    addDataPoint(performanceData);
    (window as any).lastTime = performance.now();
    
    if (statsRef.current) {
      statsRef.current.end();
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
