import React, { createContext, useContext, ReactNode } from 'react';
import { useOptimizedPerformance } from '@/lib/use-optimized-performance';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  isMonitoring: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function usePerformanceMetrics() {
  const context = useContext(PerformanceContext);
  if (!context) {
    // Return mock data when context is not available
    return {
      metrics: {
        fps: 60,
        frameTime: 16.7,
        memoryUsage: 45,
        drawCalls: 12,
        triangles: 1024
      },
      isMonitoring: false
    };
  }
  return context;
}

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const performanceData = useOptimizedPerformance();
  
  const metrics: PerformanceMetrics = {
    fps: performanceData.fps,
    frameTime: performanceData.frameTime,
    memoryUsage: performanceData.memoryUsage,
    drawCalls: performanceData.drawCalls || 12, // fallback
    triangles: performanceData.triangles || 1024 // fallback
  };

  const contextValue: PerformanceContextType = {
    metrics,
    isMonitoring: true
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}
