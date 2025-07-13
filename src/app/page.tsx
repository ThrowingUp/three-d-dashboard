'use client';

import { useState, useEffect } from 'react';
import { experiments, getExperimentComponent } from '@/experiments';
import ExperimentSidebar from '@/components/ui/ExperimentSidebar';
import PerformanceCanvas from '@/components/ui/PerformanceCanvas';
import RightSidebar from '@/components/ui/RightSidebar';
import { useKeyboardShortcuts } from '@/lib/use-keyboard-shortcuts';

export default function Home() {
  const [currentExperiment, setCurrentExperiment] = useState<string>(experiments[0]?.id || '');
  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  const CurrentExperimentComponent = getExperimentComponent(currentExperiment);
  const currentExperimentData = experiments.find(exp => exp.id === currentExperiment);

  // Leva preset logic
  const [levaDefaults, setLevaDefaults] = useState<any>({});
  const [levaKey, setLevaKey] = useState<string>('');

  useEffect(() => {
    if (!currentExperiment) return;
    const savedPresetsKey = `leva-presets-${currentExperiment}`;
    const existingPresets = JSON.parse(localStorage.getItem(savedPresetsKey) || '[]');
    if (existingPresets.length > 0) {
      const lastPreset = existingPresets[existingPresets.length - 1];
      setLevaDefaults(lastPreset.controls || {});
      setLevaKey(`${currentExperiment}-${lastPreset.timestamp}`);
    } else {
      setLevaDefaults({});
      setLevaKey(currentExperiment);
    }
  }, [currentExperiment]);

  return (
    <div className="relative min-h-screen min-w-full bg-[#121213] overflow-hidden">
      {/* 3D Experiment Full Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {CurrentExperimentComponent ? (
          <PerformanceCanvas className="w-full h-full">
            <CurrentExperimentComponent key={levaKey} levaDefaults={levaDefaults} />
          </PerformanceCanvas>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select an experiment from the sidebar to get started</p>
          </div>
        )}
      </div>

      {/* Left Sidebar */}
      <div className="relative z-10">
        <ExperimentSidebar
          experiments={experiments}
          currentExperiment={currentExperiment}
          onExperimentSelect={setCurrentExperiment}
        />
      </div>

      {/* Right Sidebar */}
      <RightSidebar currentExperiment={currentExperimentData} />
    </div>
  );
}
