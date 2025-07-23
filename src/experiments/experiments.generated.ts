// AUTO-GENERATED FILE. DO NOT EDIT.
import { Experiment } from '@/types/experiments';
import Exp0 from './BasicCube.tsx';
import Exp1 from './Cabinets.tsx';
import Exp2 from './FloatingCubes.tsx';
import Exp3 from './Glowgrid.tsx';
import Exp4 from './HexaGlow.tsx';
import Exp5 from './HexaGridsSimple.tsx';
import Exp6 from './MaterialSpheres.tsx';
import Exp7 from './NewMouse_1.tsx';
import Exp8 from './universe.tsx';
import Exp9 from './WaveGrid.tsx';

export const experiments: Experiment[] = [
  {
    id: 'basic-cube',
    title: 'Rotating Cube',
    description: 'A simple rotating cube demonstrating basic Three.js concepts with React Three Fiber.',
    component: Exp0,
    category: 'basics',
    difficulty: 'beginner',
    tags: ["cube","rotation","mesh","materials"],
  },
  {
    id: 'cabinets',
    title: 'Cabinets',
    description: '',
    component: Exp1,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'floating-cubes',
    title: 'Floating Cubes',
    description: 'Colorful cubes floating in a circular pattern with smooth animations.',
    component: Exp2,
    category: 'animation',
    difficulty: 'beginner',
    tags: ["animation","cubes"],
  },
  {
    id: 'glowgrid',
    title: 'Glowgrid',
    description: '',
    component: Exp3,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'hexaglow',
    title: 'HexaGlow',
    description: '',
    component: Exp4,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'hexa-grids',
    title: 'Hexa Grids',
    description: 'Simple wireframe cube demonstrating basic rotation and materials.',
    component: Exp5,
    category: 'geometry',
    difficulty: 'beginner',
    tags: ["wireframe","rotation"],
  },
  {
    id: 'material-spheres',
    title: 'Material Spheres',
    description: 'Floating spheres with different materials and colors showcasing lighting effects.',
    component: Exp6,
    category: 'materials',
    difficulty: 'beginner',
    tags: ["spheres","materials","lighting","animation"],
  },
  {
    id: 'mouse-follow-glow',
    title: 'Mouse Follow Glow',
    description: 'Mouse-following glowing sphere with bloom and color burst effect.',
    component: Exp7,
    category: 'postprocessing',
    difficulty: 'intermediate',
    tags: ["mouse","bloom","glow","color"],
  },
  {
    id: 'universe',
    title: 'universe',
    description: '',
    component: Exp8,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'wavegrid',
    title: 'WaveGrid',
    description: '',
    component: Exp9,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
];

export function getExperimentComponent(id: string) {
  const experiment = experiments.find(exp => exp.id === id);
  return experiment?.component;
}
