'use client';

import { useState, useEffect } from 'react';
import { Leva } from 'leva';
import { Experiment } from '@/types/experiments';
import { BookmarkIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import { usePerformanceStore } from '@/lib/performance-store';

interface RightSidebarProps {
  currentExperiment?: Experiment;
}

function PerformanceMonitor() {
  const { currentData } = usePerformanceStore();
  const [displayedMetrics, setDisplayedMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: { total: 0 },
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
  });

  // Update immediately when currentData changes
  useEffect(() => {
    if (currentData) {
      setDisplayedMetrics(currentData);
    }
  }, [currentData]);

  // Update every 100ms for smoother display (10 FPS update rate)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentData) {
        setDisplayedMetrics(currentData);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentData]);

  const metrics = displayedMetrics;

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-[var(--success)]';
    if (fps >= 30) return 'text-[var(--warning)]';
    return 'text-[var(--error)]';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Performance</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">FPS</div>
          <div className={`text-base font-mono font-semibold ${getFpsColor(metrics.fps)}`}>
            {metrics.fps || '--'}
          </div>
        </div>
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Frame Time</div>
          <div className="text-base font-mono font-semibold text-[var(--brand-primary)]">
            {metrics.frameTime ? metrics.frameTime.toFixed(1) + 'ms' : '--'}
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="rounded-lg p-3 border border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">Memory</span>
          <span className="text-xs font-mono text-[var(--text-primary)]">
            {metrics.memoryUsage?.total || 0} MB
          </span>
        </div>
        <div className="w-full bg-[var(--background-secondary)] rounded-full h-1.5">
          <div 
            className="h-1.5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]"
            style={{ width: `${Math.min((metrics.memoryUsage?.total || 0) / 100 * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* WebGL Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Draw Calls</div>
          <div className="text-sm font-mono text-[var(--text-primary)]">
            {metrics.drawCalls || '--'}
          </div>
        </div>
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Triangles</div>
          <div className="text-sm font-mono text-[var(--text-primary)]">
            {metrics.triangles ? metrics.triangles.toLocaleString() : '--'}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Geometries</div>
          <div className="text-sm font-mono text-[var(--text-primary)]">
            {metrics.geometries || '--'}
          </div>
        </div>
        <div className="rounded-lg p-3 border border-[var(--border-color)]">
          <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Textures</div>
          <div className="text-sm font-mono text-[var(--text-primary)]">
            {metrics.textures || '--'}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectInfo({ experiment }: { experiment: Experiment }) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? experiment.tags : experiment.tags.slice(0, 2);
  const remainingCount = experiment.tags.length - 2;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{experiment.title}</h2>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{experiment.description}</p>
      
      <div className="flex flex-wrap items-center gap-2">
        <span className={`
          px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide border
          ${experiment.difficulty === 'beginner' ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' :
            experiment.difficulty === 'intermediate' ? 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20' :
            'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20'
          }
        `}>
          {experiment.difficulty}
        </span>
        <span className="px-2 py-0.5 bg-[var(--background-accent)] text-[var(--text-secondary)] rounded-md text-[10px] font-medium tracking-wide uppercase border border-[var(--border-color)]">
          {experiment.category}
        </span>
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-[var(--background-accent)] text-[var(--text-secondary)] rounded-md text-[10px] font-medium tracking-wide uppercase">
              {tag}
            </span>
          ))}
          {!showAllTags && remainingCount > 0 && (
            <button
              onClick={() => setShowAllTags(true)}
              className="px-2 py-0.5 bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-md text-[10px] hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-1 border border-[var(--border-color)]"
            >
              +{remainingCount} <ChevronDownIcon className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {showAllTags && remainingCount > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {experiment.tags.slice(2).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-[var(--background-accent)] text-[var(--text-secondary)] rounded-md text-[10px] font-medium tracking-wide uppercase">
                {tag}
              </span>
            ))}
            <button
              onClick={() => setShowAllTags(false)}
              className="px-2 py-0.5 bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-md text-[10px] hover:bg-[var(--background-secondary)] transition-colors border border-[var(--border-color)]"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RightSidebar({ currentExperiment }: RightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSavePreset = async () => {
    setSaveStatus('saving');
    
    try {
      // Get current experiment identifier
      const experimentId = currentExperiment?.id?.toLowerCase() || 'unknown';
      
      // Get current Leva values using window hack approach
      let currentLevaValues = {};
      try {
        // Access Leva's internal store through window
        const levaStore = (window as any).leva;
        if (levaStore && levaStore.useStore) {
          const storeData = levaStore.useStore.getState();
          currentLevaValues = storeData.data || {};
        }
        
        // Alternative: try to get values from Leva's global state
        if (Object.keys(currentLevaValues).length === 0) {
          const levaState = (window as any).__LEVA__;
          if (levaState && levaState.globalStore) {
            currentLevaValues = levaState.globalStore.getData() || {};
          }
        }
        
        // Fallback: try to get from DOM elements
        if (Object.keys(currentLevaValues).length === 0) {
          const levaInputs = document.querySelectorAll('[data-leva-path]');
          const values: any = {};
          levaInputs.forEach((input: any) => {
            const path = input.getAttribute('data-leva-path');
            if (path && input.value !== undefined) {
              values[path] = input.value;
            }
          });
          currentLevaValues = values;
        }
      } catch (levaError) {
        console.log('Could not access Leva values:', levaError);
      }
      const presetData = {
        experimentId,
        controls: currentLevaValues,
        timestamp: new Date().toISOString(),
        name: `${currentExperiment?.title || 'Preset'} - ${new Date().toLocaleString()}`,
        version: '1.0'
      };
      const savedPresetsKey = `leva-presets-${experimentId}`;
      const existingPresets = JSON.parse(localStorage.getItem(savedPresetsKey) || '[]');
      existingPresets.push(presetData);
      if (existingPresets.length > 10) {
        existingPresets.splice(0, existingPresets.length - 10);
      }
      localStorage.setItem(savedPresetsKey, JSON.stringify(existingPresets));
      const saveEvent = new CustomEvent('leva-preset-saved', { detail: presetData });
      window.dispatchEvent(saveEvent);
      // Try to save to server (optional)
      try {
        const response = await fetch('/api/save-preset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presetData),
        });
        if (response.ok) {
          console.log('Preset saved to server successfully');
        }
      } catch (serverError) {
        console.log('Server save failed, but local save succeeded:', serverError);
      }
      setSaveStatus('saved');
      console.log('Preset saved successfully:', presetData);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div
      className={
        `fixed right-2 top-2 bottom-2 z-50 bg-[var(--background-overlay)] backdrop-blur-md border border-[var(--border-color)] ` +
        `rounded-2xl shadow-lg transition-all duration-300 ease-in-out ` +
        (isCollapsed ? 'w-12 ' : 'w-78 ') +
        (isCollapsed ? 'max-lg:w-12 ' : 'max-lg:w-72 ') +
        (isCollapsed ? 'max-md:w-10 ' : 'max-md:w-64 ')
      }
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-1 top-6 bg-[var(--background-primary)] border border-[var(--border-color)] rounded-full p-1.5 \
                   shadow-md hover:shadow-lg transition-shadow"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronLeftIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className={`h-full flex flex-col ${isCollapsed ? 'hidden' : 'block'}`}>
        {/* Save Button Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-secondary)]">Controls</h3>
          <button
            onClick={handleSavePreset}
            disabled={saveStatus === 'saving'}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all
              ${saveStatus === 'saved' ? 'bg-[var(--success)] text-white border-[var(--success)]' :
                saveStatus === 'error' ? 'bg-[var(--error)] text-white border-[var(--error)]' :
                saveStatus === 'saving' ? 'bg-[var(--text-secondary)] text-white opacity-50 border-[var(--text-secondary)]' :
                'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary)]/80 border-[var(--brand-primary)]'}
            `}
          >
            <BookmarkIcon className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Saving...' :
             saveStatus === 'saved' ? 'Saved!' :
             saveStatus === 'error' ? 'Error!' :
             'Save Preset'}
          </button>
        </div>

        {/* Project Info */}
        {currentExperiment && (
          <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
            <ProjectInfo experiment={currentExperiment} />
          </div>
        )}

        {/* Performance Monitor (moved above Parameters) */}
        <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
          <PerformanceMonitor />
        </div>

        {/* Leva Controls */}
        <div className="px-4 pt-4 pb-3 flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-secondary)] mb-3">Parameters</h3>
          <div className="
            [&_.leva-c-ksEKSR]:!bg-[var(--background-card)] 
            [&_.leva-c-ksEKSR]:!border-[var(--border-color)] 
            [&_.leva-c-ksEKSR]:!shadow-none 
            [&_.leva-c-ksEKSR]:!backdrop-blur-none
            [&_.leva-c-hzXJhf]:!text-[var(--text-primary)]
            [&_.leva-c-hzXJhf]:!font-medium
            [&_.leva-c-hzXJhf]:!text-xs
            [&_.leva-c-kcodWe]:!bg-[var(--background-secondary)]
            [&_.leva-c-kcodWe]:!border-[var(--border-color)]
            [&_.leva-c-kcodWe]:!text-[var(--text-primary)]
            [&_.leva-c-kcodWe]:focus:!border-[var(--brand-primary)]
            [&_.leva-c-kcodWe]:focus:!ring-2
            [&_.leva-c-kcodWe]:focus:!ring-[var(--brand-primary)]/20
            [&_.leva-c-kcodWe]:!rounded-md
            [&_.leva-c-kcodWe]:!font-mono
            [&_.leva-c-kcodWe]:!text-xs
            [&_.leva-c-kcodWe]:!transition-all
            [&_.leva-c-kcodWe]:!duration-200
          ">
            <Leva fill flat titleBar={false} />
          </div>
        </div>
      </div>
      {/* Collapsed State */}
      {isCollapsed && (
        <div className="h-full flex flex-col items-center justify-center p-2">
          <div className="text-xs text-[var(--text-secondary)] writing-vertical text-center">
            Controls
          </div>
        </div>
      )}
    </div>
  );
}
