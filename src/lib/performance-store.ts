import { create } from 'zustand';

export interface PerformanceData {
  fps: number;
  frameTime: number;
  drawCalls: number;
  geometries: number;
  textures: number;
  programs: number;
  memoryUsage: {
    geometries: number;
    textures: number;
    programs: number;
    total: number;
  };
  gpuLoad: number;
  visibleMeshes: number;
  triangles: number;
  timestamp: number;
}

interface PerformanceStore {
  data: PerformanceData[];
  currentData: PerformanceData | null;
  isRecording: boolean;
  maxDataPoints: number;
  
  // Actions
  addDataPoint: (data: PerformanceData) => void;
  toggleRecording: () => void;
  clearData: () => void;
  setCurrentData: (data: PerformanceData) => void;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  data: [],
  currentData: null,
  isRecording: true,
  maxDataPoints: 300, // 5 minutes at 60fps
  
  addDataPoint: (data: PerformanceData) => {
    const state = get();
    if (!state.isRecording) return;
    
    set((state) => ({
      data: [...state.data.slice(-state.maxDataPoints + 1), data],
      currentData: data,
    }));
  },
  
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
  
  clearData: () => set({ data: [], currentData: null }),
  
  setCurrentData: (data: PerformanceData) => set({ currentData: data }),
}));
