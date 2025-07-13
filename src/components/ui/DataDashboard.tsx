'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Database, 
  Clock, 
  Cpu, 
  HardDrive,
  X 
} from 'lucide-react';
import { usePerformanceStore } from '@/lib/performance-store';

interface DataDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataDashboard({ isOpen, onClose }: DataDashboardProps) {
  const [activeTab, setActiveTab] = useState<'performance' | 'memory' | 'network' | 'logs'>('performance');
  const { data, currentData } = usePerformanceStore();

  if (!isOpen) return null;

  const tabs = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'memory', label: 'Memory', icon: HardDrive },
    { id: 'network', label: 'Network', icon: Activity },
    { id: 'logs', label: 'Logs', icon: Database },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
                <div className="text-lg font-bold text-green-400">{currentData?.fps || 0}</div>
                <div className="text-xs text-[var(--text-secondary)]">Current FPS</div>
              </div>
              <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-400">{currentData?.frameTime.toFixed(1) || 0}ms</div>
                <div className="text-xs text-[var(--text-secondary)]">Frame Time</div>
              </div>
              <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
                <div className="text-lg font-bold text-purple-400">{currentData?.drawCalls || 0}</div>
                <div className="text-xs text-[var(--text-secondary)]">Draw Calls</div>
              </div>
            </div>
            
            <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
              <h4 className="heading-5 mb-2">Performance History</h4>
              <div className="h-32 bg-[var(--background-tertiary)] rounded flex items-center justify-center">
                <span className="text-xs text-[var(--text-secondary)]">Chart placeholder - {data.length} data points</span>
              </div>
            </div>
          </div>
        );
      
      case 'memory':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-400">{currentData?.memoryUsage.geometries || 0}</div>
                <div className="text-xs text-[var(--text-secondary)]">Geometries</div>
              </div>
              <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
                <div className="text-lg font-bold text-green-400">{currentData?.memoryUsage.textures || 0}</div>
                <div className="text-xs text-[var(--text-secondary)]">Textures</div>
              </div>
            </div>
            
            <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
              <h4 className="heading-5 mb-2">Memory Usage Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Programs:</span>
                  <span>{currentData?.memoryUsage.programs || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Visible Meshes:</span>
                  <span>{currentData?.visibleMeshes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'network':
        return (
          <div className="space-y-4">
            <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
              <h4 className="heading-5 mb-2">Network Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Connection:</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Assets Loaded:</span>
                  <span>12/12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Load Time:</span>
                  <span>2.4s</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'logs':
        return (
          <div className="space-y-4">
            <div className="bg-[var(--background-secondary)] p-3 rounded-lg">
              <h4 className="heading-5 mb-2">Recent Logs</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-green-400">[INFO] Scene initialized</div>
                <div className="text-blue-400">[DEBUG] Camera position updated</div>
                <div className="text-yellow-400">[WARN] FPS below threshold</div>
                <div className="text-green-400">[INFO] Stress test completed</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[var(--background-card)] border border-[var(--border-color)] rounded-2xl shadow-lg w-[800px] h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="heading-3">Data Dashboard</h2>
          <button
            onClick={onClose}
            className="glass-btn-icon btn-primary"
            title="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5 btn-primary'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
