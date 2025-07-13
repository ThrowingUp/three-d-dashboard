'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

export function useOptimizedPerformance() {
  const { gl } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0
  });
  
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsBufferRef = useRef<number[]>([]);
  
  useFrame(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    // Calculate FPS with smoothing
    const instantFps = 1000 / deltaTime;
    fpsBufferRef.current.push(instantFps);
    if (fpsBufferRef.current.length > 10) {
      fpsBufferRef.current.shift();
    }
    
    // Update metrics every 60 frames (~1 second at 60fps)
    if (frameRef.current % 60 === 0) {
      const avgFps = fpsBufferRef.current.reduce((a, b) => a + b, 0) / fpsBufferRef.current.length;
      
      setMetrics({
        fps: Math.round(avgFps),
        frameTime: Math.round(deltaTime * 10) / 10,
        memoryUsage: Math.round((performance as any).memory?.usedJSHeapSize / 1048576) || 0,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles
      });
      
      // Reset WebGL info counters
      gl.info.reset();
    }
    
    frameRef.current++;
    lastTimeRef.current = now;
  });
  
  return metrics;
}
