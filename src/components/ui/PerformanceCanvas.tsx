'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { usePerformanceMonitor } from '@/lib/use-performance-monitor';
import { useThreeToolkit } from '@/lib/use-three-toolkit';
import HudPanel from '@/components/ui/HudPanel';
import ActionBarV2 from '@/components/ui/ActionBarV2';

interface PerformanceCanvasProps {
  children: ReactNode;
  className?: string;
}

function PerformanceWrapper({ children, onToolkitReady }: { children: ReactNode; onToolkitReady?: (toolkit: any) => void }) {
  usePerformanceMonitor();
  const toolkit = useThreeToolkit();
  const [stressTestActive, setStressTestActive] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  
  // Notify parent of toolkit availability
  useEffect(() => {
    if (onToolkitReady) {
      onToolkitReady(toolkit);
    }
  }, [toolkit, onToolkitReady]);
  
  // Listen for global events
  useEffect(() => {
    const handleWireframe = (e: any) => {
      const enabled = e.detail.wireframe;
      setWireframeMode(enabled);
      toolkit.scene.toggleWireframe(enabled);
    };
    
    const handleStressTest = () => {
      const newState = !stressTestActive;
      setStressTestActive(newState);
      if (newState) {
        toolkit.scene.addStressTest(100);
      } else {
        toolkit.scene.removeStressTest();
      }
    };
    
    const handleResetScene = () => {
      setStressTestActive(false);
      setWireframeMode(false);
      toolkit.scene.removeStressTest();
      toolkit.scene.toggleWireframe(false);
    };
    
    const handleScreenshot = () => {
      toolkit.scene.takeScreenshot();
    };

    window.addEventListener('toggleWireframe', handleWireframe);
    window.addEventListener('stressTest', handleStressTest);
    window.addEventListener('resetScene', handleResetScene);
    window.addEventListener('takeScreenshot', handleScreenshot);
    
    return () => {
      window.removeEventListener('toggleWireframe', handleWireframe);
      window.removeEventListener('stressTest', handleStressTest);
      window.removeEventListener('resetScene', handleResetScene);
      window.removeEventListener('takeScreenshot', handleScreenshot);
    };
  }, [stressTestActive, toolkit]);

  // Make toolkit available globally for ActionBar
  useEffect(() => {
    (window as any).threeToolkit = toolkit;
  }, [toolkit]);
  
  return (
    <>
      {children}
      
      {/* Stress Test Cubes */}
      {stressTestActive && (
        <group>
          {Array.from({ length: 100 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
            </mesh>
          ))}
        </group>
      )}
      
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

export default function PerformanceCanvas({ children, className = '' }: PerformanceCanvasProps) {
  const [isHudVisible, setIsHudVisible] = useState(false); // Changed to false by default
  const [wireframeMode, setWireframeMode] = useState(false);
  const [toolkit, setToolkit] = useState<any>(null);

  const handleToggleWireframe = () => {
    setWireframeMode(!wireframeMode);
    // Dispatch event to scene
    window.dispatchEvent(new CustomEvent('toggleWireframe', { 
      detail: { wireframe: !wireframeMode } 
    }));
  };

  const handleStressTest = () => {
    window.dispatchEvent(new CustomEvent('stressTest'));
  };

  const handleResetScene = () => {
    setWireframeMode(false);
    window.dispatchEvent(new CustomEvent('resetScene'));
  };

  const handleExportData = () => {
    // Export performance data logic
    window.dispatchEvent(new CustomEvent('exportData'));
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        
        <PerformanceWrapper onToolkitReady={setToolkit}>
          {children}
        </PerformanceWrapper>
      </Canvas>
      
      {/* HUD Overlay */}
      {isHudVisible && (
        <HudPanel className="absolute bottom-4 right-4 w-80" />
      )}
      
      {/* New Action Bar V2 */}
      <ActionBarV2
        onToggleHUD={() => setIsHudVisible(!isHudVisible)}
        onToggleWireframe={handleToggleWireframe}
        onStressTest={handleStressTest}
        onReset={handleResetScene}
        onExport={handleExportData}
        isHudVisible={isHudVisible}
        wireframeMode={wireframeMode}
        toolkit={toolkit}
      />
    </div>
  );
}

/* In je globals.css toevoegen voor glass effect: */
/*
.glass-btn {
  @apply px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow border border-[var(--border-color)] backdrop-blur-md bg-[var(--background-overlay)]/70 text-[var(--text-primary)] hover:bg-[var(--background-overlay)]/90 hover:shadow-lg;
}
*/
