# Three.js Toolkit & Performance Dashboard

Een complete toolkit voor Three.js projecten met performance monitoring, debug tools en scene manipulatie.

## 🚀 Quick Start

### 1. Basis Setup

Wrap je Three.js experiment in de `PerformanceCanvas` component:

```tsx
import PerformanceCanvas from '@/components/ui/PerformanceCanvas';

function MyExperiment() {
  return (
    <PerformanceCanvas>
      {/* Je Three.js content hier */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
    </PerformanceCanvas>
  );
}
```

### 2. Gebruik van de Toolkit Hook

Voor geavanceerde functionaliteiten, gebruik de `useThreeToolkit` hook binnen je Three.js componenten:

```tsx
import { useThreeToolkit } from '@/lib/use-three-toolkit';

function MyThreeComponent() {
  const toolkit = useThreeToolkit();
  
  const handleCustomAction = () => {
    // Scene manipulatie
    toolkit.scene.toggleWireframe();
    toolkit.scene.takeScreenshot();
    
    // Debug helpers
    toolkit.debug.showGrid();
    toolkit.debug.logSceneInfo();
    
    // Performance info
    const stats = toolkit.performance.getPerformanceInfo();
    console.log('Draw calls:', stats.drawCalls);
  };

  return (
    <mesh onClick={handleCustomAction}>
      <sphereGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

## 🎮 Action Bar Functionaliteiten

De action bar onderaan bevat verschillende gegroepeerde functionaliteiten:

### Performance Controls
- **HUD Toggle**: Toon/verberg performance dashboard (Shortcut: `H`)
- **Sparklines**: Real-time performance grafieken

### Debug Tools  
- **Stress Test**: Voeg 100 test objecten toe voor performance testing
- **Scene Inspector**: Bekijk scene hiërarchie en objecten

### Scene Actions
- **Wireframe**: Toggle wireframe mode voor alle materialen (Shortcut: `W`)
- **Grid Helper**: Toon/verberg grid in de scene
- **Axes Helper**: Toon/verberg XYZ assen
- **Reset**: Reset hele scene naar oorspronkelijke staat (Shortcut: `R`)
- **Screenshot**: Maak screenshot van huidige scene (Shortcut: `S`)

### Data & Logs
- **Export JSON**: Exporteer performance data
- **Data Dashboard**: Open uitgebreide data dashboard modal

### Presets
- **Basic**: Minimale interface
- **Advanced**: Met grid helpers
- **Debug**: Volledig debug mode met alle helpers

## 📊 Performance Dashboard

Het HUD panel (rechts onder) toont:

- **Real-time FPS**: Huidige en gemiddelde framerate
- **Frame Time**: Tijd per frame in milliseconden  
- **Draw Calls**: Aantal GPU draw calls
- **Memory Usage**: Geometrieën, texturen, programma's
- **Visual Charts**: Performance trends over tijd

### Data Dashboard Modal

Toegankelijk via de action bar, bevat tabs voor:

1. **Performance**: Uitgebreide metrics en grafieken
2. **Memory**: Memory usage breakdown
3. **Network**: Asset loading informatie
4. **Logs**: Real-time event logging

## 🛠️ Toolkit API Reference

### Scene Actions

```tsx
const toolkit = useThreeToolkit();

// Wireframe manipulatie
toolkit.scene.toggleWireframe(true/false);

// Camera reset
toolkit.scene.resetCamera();

// Screenshot maken
toolkit.scene.takeScreenshot('custom-name.png');

// Scene statistieken
const stats = toolkit.scene.getSceneStats();
// Returns: { meshes, lights, materials, geometries, triangles, drawCalls }

// Scene opruimen
toolkit.scene.clearScene();

// Stress test objecten
const group = toolkit.scene.addStressTest(100); // 100 objecten
toolkit.scene.removeStressTest();

// Object visibility
toolkit.scene.toggleVisibility('objectName');

// Scene hiërarchie
const tree = toolkit.scene.getSceneTree();
```

### Debug Utilities

```tsx
// Helpers tonen/verbergen
toolkit.debug.showAxes(5); // Size 5
toolkit.debug.hideAxes();
toolkit.debug.showGrid(10, 10); // Size 10, 10 divisions  
toolkit.debug.hideGrid();

// Console logging
toolkit.debug.logSceneInfo();
```

### Performance Utilities

```tsx
// Performance metrics
const info = toolkit.performance.getPerformanceInfo();
// Returns: { drawCalls, triangles, points, lines, memory, programs }

// Scene optimizatie
toolkit.performance.optimizeScene();
```

## 🎯 Global Event System

De toolkit gebruikt een event-based systeem voor communicatie:

```tsx
// Custom events dispatchen
window.dispatchEvent(new CustomEvent('toggleWireframe', { 
  detail: { wireframe: true } 
}));

window.dispatchEvent(new CustomEvent('stressTest'));
window.dispatchEvent(new CustomEvent('resetScene'));
window.dispatchEvent(new CustomEvent('takeScreenshot'));

// Preset wijzigingen
window.dispatchEvent(new CustomEvent('presetChange', { 
  detail: { preset: 'debug' } 
}));
```

## ⌨️ Keyboard Shortcuts

- `H`: Toggle HUD visibility
- `W`: Toggle wireframe mode
- `R`: Reset scene
- `S`: Take screenshot
- `Ctrl+E`: Export performance data

## 🎨 Styling & Theming

De toolkit gebruikt design tokens uit `globals.css`:

```css
/* Pas kleuren aan via CSS variabelen */
:root {
  --background-overlay: rgba(20, 20, 20, 0.8);
  --brand-primary: #3b82f6;
  --text-primary: #ededed;
  /* etc... */
}

/* Glass button styles zijn beschikbaar */
.glass-btn { /* Voor text buttons */ }
.glass-btn-icon { /* Voor icon buttons */ }
.glass-btn-icon.active { /* Voor active states */ }
```

## 📦 Dependencies

- `@react-three/fiber`: React Three.js integratie
- `@react-three/drei`: Three.js helpers
- `lucide-react`: Iconen
- `recharts`: Performance charts
- `zustand`: State management
- `stats.js`: Performance monitoring

## 🔧 Aanpassing & Uitbreiding

### Custom Actions Toevoegen

```tsx
// Extend de toolkit in je eigen hook
function useCustomToolkit() {
  const baseToolkit = useThreeToolkit();
  
  const customActions = {
    explodeObjects: () => {
      // Custom scene manipulatie
    },
    
    changeTheme: (theme: string) => {
      // Custom theming logic
    }
  };
  
  return {
    ...baseToolkit,
    custom: customActions
  };
}
```

### Performance Monitoring Uitbreiden

```tsx
// Custom performance metrics
const customMetrics = {
  customMetric: calculateCustomMetric(),
  // Voeg toe aan performance store
};

usePerformanceStore.getState().addDataPoint({
  ...standardMetrics,
  ...customMetrics
});
```

## 🐛 Troubleshooting

### Performance Issues
- Gebruik stress test om bottlenecks te vinden
- Check draw calls in HUD panel
- Monitor memory usage voor leaks

### Toolkit Niet Beschikbaar
- Zorg dat `useThreeToolkit` binnen Canvas context wordt gebruikt
- Check of `PerformanceCanvas` correct gewrapped is

### Events Niet Werkend
- Verify event listeners in useEffect cleanup
- Check browser developer tools voor event dispatching

## 📝 Voorbeelden

Zie de `/src/experiments/` folder voor werkende voorbeelden van:
- BasicCube: Simpele roterende cube
- MaterialSpheres: Zwevende sferen met verschillende materialen

Beide experiments gebruiken de volledige toolkit functionaliteit.
