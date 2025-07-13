'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Bug, 
  Square, 
  RotateCcw, 
  Camera, 
  Download, 
  Settings, 
  Monitor,
  AlertTriangle,
  Eye,
  EyeOff,
  Zap,
  ChevronDown,
  Play,
  Pause,
  FileText,
  BarChart,
  Grid3X3,
  Move3D
} from 'lucide-react';
import DataDashboard from './DataDashboard';

interface ActionBarV2Props {
  className?: string;
  onToggleHUD?: () => void;
  onToggleWireframe?: () => void;
  onStressTest?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  isHudVisible?: boolean;
  wireframeMode?: boolean;
  toolkit?: any; // Three.js toolkit functions
}

export default function ActionBarV2({
  className = '',
  onToggleHUD,
  onToggleWireframe,
  onStressTest,
  onReset,
  onExport,
  isHudVisible = true,
  wireframeMode = false,
  toolkit
}: ActionBarV2Props) {
  const [activePreset, setActivePreset] = useState<'basic' | 'advanced' | 'debug'>('basic');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDataDashboard, setShowDataDashboard] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showAxes, setShowAxes] = useState(false);

  const handleStressTest = () => {
    setIsStressTesting(!isStressTesting);
    if (toolkit) {
      if (!isStressTesting) {
        toolkit.scene.addStressTest(100);
      } else {
        toolkit.scene.removeStressTest();
      }
    }
    onStressTest?.();
  };

  const handleWireframe = () => {
    if (toolkit) {
      toolkit.scene.toggleWireframe();
    }
    onToggleWireframe?.();
  };

  const handleReset = () => {
    if (toolkit) {
      toolkit.scene.clearScene();
      toolkit.scene.resetCamera();
      setIsStressTesting(false);
      setShowGrid(false);
      setShowAxes(false);
    }
    onReset?.();
  };

  const handleScreenshot = () => {
    if (toolkit) {
      toolkit.scene.takeScreenshot();
    }
  };

  const handleToggleGrid = () => {
    if (toolkit) {
      if (!showGrid) {
        toolkit.debug.showGrid();
      } else {
        toolkit.debug.hideGrid();
      }
      setShowGrid(!showGrid);
    }
  };

  const handleToggleAxes = () => {
    if (toolkit) {
      if (!showAxes) {
        toolkit.debug.showAxes();
      } else {
        toolkit.debug.hideAxes();
      }
      setShowAxes(!showAxes);
    }
  };

  const handlePresetChange = (preset: 'basic' | 'advanced' | 'debug') => {
    setActivePreset(preset);
    
    // Apply preset configurations
    if (toolkit) {
      switch (preset) {
        case 'basic':
          toolkit.debug.hideGrid();
          toolkit.debug.hideAxes();
          setShowGrid(false);
          setShowAxes(false);
          break;
        case 'advanced':
          toolkit.debug.showGrid();
          setShowGrid(true);
          break;
        case 'debug':
          toolkit.debug.showGrid();
          toolkit.debug.showAxes();
          toolkit.debug.logSceneInfo();
          setShowGrid(true);
          setShowAxes(true);
          break;
      }
    }
    
    // Dispatch preset change event
    window.dispatchEvent(new CustomEvent('presetChange', { detail: { preset } }));
  };

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 ${className}`}>
      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute bottom-full mb-2 left-0 w-80 card-depth bg-[var(--background-overlay)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="heading-5">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-[var(--brand-warning)/10] rounded text-xs">
              <AlertTriangle className="w-4 h-4 text-[var(--brand-warning)]" />
              <span>FPS dropped below 30</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[var(--brand-success)/10] rounded text-xs">
              <Monitor className="w-4 h-4 text-[var(--brand-success)]" />
              <span>Scene loaded successfully</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 bg-[var(--background-overlay)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] shadow-lg p-3">
        
        {/* Performance Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium">Performance</span>
          
          <button
            onClick={onToggleHUD}
            className={`glass-btn-icon ${isHudVisible ? 'active' : ''}`}
            title="Toggle Performance HUD (H)"
          >
            {isHudVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            className="glass-btn-icon"
            title="Toggle Sparklines"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-[var(--border-color)]" />

        {/* Debug Tools */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium">Debug</span>
          
          <button
            onClick={handleStressTest}
            className={`glass-btn-icon ${isStressTesting ? 'active' : ''}`}
            title="Stress Test (100 cubes)"
          >
            {isStressTesting ? <Pause className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
          
          <button
            className="glass-btn-icon"
            title="Scene Tree Inspector"
          >
            <Bug className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-[var(--border-color)]" />

        {/* Scene Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium">Scene</span>
          
          <button
            onClick={handleWireframe}
            className={`glass-btn-icon ${wireframeMode ? 'active' : ''}`}
            title="Toggle Wireframe (W)"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleGrid}
            className={`glass-btn-icon ${showGrid ? 'active primary-glow' : ''}`}
            title="Toggle Grid Helper"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleAxes}
            className={`glass-btn-icon ${showAxes ? 'active' : ''}`}
            title="Toggle Axes Helper"
          >
            <Move3D className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleReset}
            className="glass-btn-icon"
            title="Reset Scene (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleScreenshot}
            className="glass-btn-icon"
            title="Take Screenshot (S)"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-[var(--border-color)]" />

        {/* Data & Logs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium">Data</span>
          
          <button
            onClick={onExport}
            className="glass-btn-icon"
            title="Export JSON (Ctrl+E)"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowDataDashboard(true)}
            className="glass-btn-icon"
            title="Open Data Dashboard"
          >
            <BarChart className="w-4 h-4" />
          </button>
          
          <button
            className="glass-btn-icon"
            title="Open Logs Drawer"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-[var(--border-color)]" />

        {/* Preset Dropdown */}
        <div className="relative">
          <select
            value={activePreset}
            onChange={(e) => handlePresetChange(e.target.value as any)}
            className="glass-btn text-xs appearance-none cursor-pointer pr-6"
            title="Performance Preset"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
            <option value="debug">Debug</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none text-[var(--text-secondary)]" />
        </div>

        {/* Notifications Toggle */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`glass-btn-icon relative ${showNotifications ? 'active' : ''}`}
          title="Notifications"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Settings */}
        <button
          className="glass-btn-icon"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Data Dashboard Modal */}
      <DataDashboard 
        isOpen={showDataDashboard} 
        onClose={() => setShowDataDashboard(false)} 
      />
    </div>
  );
}
