// scripts/generate-experiments.js
// Node.js script: Genereert automatisch een experiments.generated.ts bestand met alle experimenten in /src/experiments

const fs = require('fs');
const path = require('path');

const experimentsDir = path.join(__dirname, '../src/experiments');
const outputFile = path.join(experimentsDir, 'experiments.generated.ts');

// Metadata fallback per bestandsnaam (optioneel uitbreiden)
const experimentMeta = {
  'BasicCube.tsx': {
    id: 'basic-cube',
    title: 'Rotating Cube',
    description: 'A simple rotating cube demonstrating basic Three.js concepts with React Three Fiber.',
    category: 'basics',
    difficulty: 'beginner',
    tags: ['cube', 'rotation', 'mesh', 'materials'],
  },
  'MaterialSpheres.tsx': {
    id: 'material-spheres',
    title: 'Material Spheres',
    description: 'Floating spheres with different materials and colors showcasing lighting effects.',
    category: 'materials',
    difficulty: 'beginner',
    tags: ['spheres', 'materials', 'lighting', 'animation'],
  },
  'HexaGridsSimple.tsx': {
    id: 'hexa-grids',
    title: 'Hexa Grids',
    description: 'Simple wireframe cube demonstrating basic rotation and materials.',
    category: 'geometry',
    difficulty: 'beginner',
    tags: ['wireframe', 'rotation'],
  },
  'MatrixGlowScene.tsx': {
    id: 'matrix-glow-scene',
    title: 'Matrix Glow Scene',
    description: 'Animated matrix of glowing spheres with dynamic scaling and movement patterns.',
    category: 'animation',
    difficulty: 'intermediate',
    tags: ['instanced mesh', 'matrix'],
  },
  'FloatingCubes.tsx': {
    id: 'floating-cubes',
    title: 'Floating Cubes',
    description: 'Colorful cubes floating in a circular pattern with smooth animations.',
    category: 'animation',
    difficulty: 'beginner',
    tags: ['animation', 'cubes'],
  },
  'NewMouse_1.tsx': {
    id: 'mouse-follow-glow',
    title: 'Mouse Follow Glow',
    description: 'Mouse-following glowing sphere with bloom and color burst effect.',
    category: 'postprocessing',
    difficulty: 'intermediate',
    tags: ['mouse', 'bloom', 'glow', 'color'],
  },
};

const files = fs.readdirSync(experimentsDir)
  .filter(f => f.endsWith('.tsx') && !['index.tsx', 'experiments.generated.tsx', 'experiments.tsx'].includes(f));

let imports = '';
let experimentArray = '';

files.forEach((file, i) => {
  const varName = 'Exp' + i;
  imports += `import ${varName} from './${file}';\n`;
  const meta = experimentMeta[file] || {};
  experimentArray += `  {\n` +
    `    id: '${meta.id || file.replace('.tsx', '').toLowerCase()}',\n` +
    `    title: '${meta.title || file.replace('.tsx', '')}',\n` +
    `    description: '${meta.description || ''}',\n` +
    `    component: ${varName},\n` +
    `    category: '${meta.category || 'basics'}',\n` +
    `    difficulty: '${meta.difficulty || 'beginner'}',\n` +
    `    tags: ${JSON.stringify(meta.tags || [])},\n` +
    `  },\n`;
});

const output = `// AUTO-GENERATED FILE. DO NOT EDIT.\n` +
  `import { Experiment } from '@/types/experiments';\n` +
  imports +
  `\nexport const experiments: Experiment[] = [\n${experimentArray}];\n\nexport function getExperimentComponent(id: string) {\n  const experiment = experiments.find(exp => exp.id === id);\n  return experiment?.component;\n}\n`;

fs.writeFileSync(outputFile, output);
console.log('Generated experiments.generated.ts with', files.length, 'experiments.');
