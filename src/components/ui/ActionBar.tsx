'use client';

import { useState } from 'react';
import { usePerformanceStore } from '@/lib/performance-store';
import { usePerformanceMonitor } from '@/lib/use-performance-monitor';

interface ActionBarProps {
  className?: string;
  onStressTest?: () => void;
  onResetScene?: () => void;
}

export default function ActionBar({ 
  className = '', 
  onStressTest,
  onResetScene 
}: ActionBarProps) {
  const { isRecording, toggleRecording, clearData } = usePerformanceStore();
  const { toggleStats, showStats, exportLogs } = usePerformanceMonitor();
  const [wireframe, setWireframe] = useState(false);
  
  const handleWireframeToggle = () => {
    setWireframe(!wireframe);
    // Apply wireframe to all materials in the scene
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toggleWireframe', { detail: { wireframe: !wireframe } });
      window.dispatchEvent(event);
    }
  };
  
  const handleStressTest = () => {
    if (onStressTest) {
      onStressTest();
    } else {
      // Default stress test - dispatch event
      const event = new CustomEvent('stressTest');
      window.dispatchEvent(event);
    }
  };
  
  const handleResetScene = () => {
    if (onResetScene) {
      onResetScene();
    } else {
      // Default reset - dispatch event
      const event = new CustomEvent('resetScene');
      window.dispatchEvent(event);
    }
    clearData();
  };
  
  return (
    <div className={`bg-[var(--background-overlay)] backdrop-blur-md text-[var(--text-primary)] p-3 rounded-2xl border border-[var(--border-color)] shadow-lg flex items-center gap-3 ${className}`}>
      {/* Recording Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRecording}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
          {isRecording ? 'Recording' : 'Paused'}
        </button>
      </div>
      
      <div className="w-px h-6 bg-[var(--border-color)]" />
      
      {/* Toggle Controls */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showStats}
            onChange={toggleStats}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            showStats ? 'bg-green-600 border-green-600' : 'border-gray-400'
          }`}>
            {showStats && <div className="w-2 h-2 bg-white rounded-sm" />}
          </div>
          <span>Stats</span>
        </label>
        
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={handleWireframeToggle}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            wireframe ? 'bg-blue-600 border-blue-600 primary-glow' : 'border-gray-400'
          }`}>
            {wireframe && <div className="w-2 h-2 bg-white rounded-sm" />}
          </div>
          <span>Wireframe</span>
        </label>
      </div>
      
      <div className="w-px h-6 bg-[var(--border-color)]" />
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleStressTest}
          className="px-3 py-1.5 bg-[var(--brand-warning)] hover:bg-yellow-700 rounded text-xs font-medium transition-colors"
        >
          Stress Test
        </button>
        
        <button
          onClick={exportLogs}
          className="px-3 py-1.5 bg-[var(--brand-primary)] hover:bg-blue-700 rounded text-xs font-medium transition-colors primary-glow"
        >
          Export Logs
        </button>
        
        <button
          onClick={handleResetScene}
          className="px-3 py-1.5 bg-[var(--background-accent)] hover:bg-gray-700 rounded text-xs font-medium transition-colors"
        >
          Reset Scene
        </button>
        
        <button
          onClick={clearData}
          className="px-3 py-1.5 bg-[var(--brand-danger)] hover:bg-red-700 rounded text-xs font-medium transition-colors"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}
