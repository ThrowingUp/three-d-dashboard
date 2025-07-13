'use client';

import { usePerformanceStore } from '@/lib/performance-store';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Area } from 'recharts';
import { useState } from 'react';

interface HudPanelProps {
  className?: string;
}

export default function HudPanel({ className = '' }: HudPanelProps) {
  const { data, currentData, isRecording } = usePerformanceStore();
  const [selectedMetric, setSelectedMetric] = useState<'fps' | 'frameTime' | 'drawCalls'>('fps');
  
  if (!currentData) return null;
  
  // Get recent data for charts (last 240 frames, ~4s at 60fps)
  const recentData = data.slice(-240).map((d, index) => ({
    ...d,
    index,
  }));

  // Smoother chart: moving average for better readability
  function movingAverage(arr: number[], windowSize: number) {
    return arr.map((_, i, a) => {
      const start = Math.max(0, i - windowSize + 1);
      const window = a.slice(start, i + 1);
      return window.reduce((sum, v) => sum + v, 0) / window.length;
    });
  }

  // Prepare smoothed data for the selected metric
  const smoothWindow = 4; // lager = minder smoothing, responsiever
  const smoothData = recentData.map((d, i, arr) => {
    const metricArr = arr.map(x => x[selectedMetric]);
    return {
      ...d,
      [selectedMetric]: movingAverage(metricArr, smoothWindow)[i],
    };
  });

  // Show the last value as a fixed number, not live-updating
  const lastSmooth = smoothData.length > 0 ? smoothData[smoothData.length - 1] : null;

  // Calculate averages
  const avgFps = smoothData.length > 0 
    ? Math.round(smoothData.reduce((sum, d) => sum + d.fps, 0) / smoothData.length)
    : 0;

  const avgFrameTime = smoothData.length > 0
    ? Math.round(smoothData.reduce((sum, d) => sum + d.frameTime, 0) / smoothData.length * 100) / 100
    : 0;
  
  // FPS Color coding
  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Memory data for pie chart
  const memoryData = [
    { name: 'Geometries', value: currentData.memoryUsage.geometries, color: '#3b82f6' },
    { name: 'Textures', value: currentData.memoryUsage.textures, color: '#10b981' },
    { name: 'Programs', value: currentData.memoryUsage.programs, color: '#f59e0b' },
  ];
  
  return (
    <div className={`bg-[var(--background-overlay)] backdrop-blur-md text-[var(--text-primary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-4">Performance Monitor</h3>
        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
      </div>
      
      {/* Live Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${getFpsColor(lastSmooth?.fps ?? 0)}`}>{lastSmooth ? Math.round(lastSmooth.fps) : 0}</div>
          <div className="text-xs text-[var(--text-secondary)]">FPS</div>
          <div className="text-xs text-[var(--text-secondary)]">avg: {avgFps}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{lastSmooth ? lastSmooth.frameTime.toFixed(1) : '0.0'}</div>
          <div className="text-xs text-[var(--text-secondary)]">ms/frame</div>
          <div className="text-xs text-[var(--text-secondary)]">avg: {avgFrameTime}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{lastSmooth ? Math.round(lastSmooth.drawCalls) : 0}</div>
          <div className="text-xs text-[var(--text-secondary)]">Draw Calls</div>
          <div className="text-xs text-[var(--text-secondary)]">meshes: {lastSmooth ? lastSmooth.visibleMeshes : 0}</div>
        </div>
      </div>
      
      {/* Chart Selector */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSelectedMetric('fps')}
          className={`px-2 py-1 text-xs rounded ${
            selectedMetric === 'fps' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          FPS
        </button>
        <button
          onClick={() => setSelectedMetric('frameTime')}
          className={`px-2 py-1 text-xs rounded ${
            selectedMetric === 'frameTime' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Frame Time
        </button>
        <button
          onClick={() => setSelectedMetric('drawCalls')}
          className={`px-2 py-1 text-xs rounded ${
            selectedMetric === 'drawCalls' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Draw Calls
        </button>
      </div>
      
      {/* Performance Chart */}
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={smoothData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="index" hide />
            <YAxis hide domain={selectedMetric === 'fps' ? [0, 120] : ['dataMin', 'dataMax']} />
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="60%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={
                selectedMetric === 'fps' ? '#10b981' :
                selectedMetric === 'frameTime' ? '#3b82f6' : '#8b5cf6'
              }
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            {/* Gradient area under the line */}
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="none"
              fill="url(#chartGradient)"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Memory Usage Pie Chart */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={memoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={8}
                outerRadius={24}
                paddingAngle={2}
              >
                {memoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1">
          <div className="label mb-1">Memory Usage</div>
          {memoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-[var(--text-secondary)]">{item.name}:</span>
              <span className="text-[var(--text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
