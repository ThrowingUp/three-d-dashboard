// AUTO-GENERATED FILE. DO NOT EDIT.
import { Experiment } from '@/types/experiments';
import Exp0 from './BasicCube.tsx';
import Exp1 from './FloatingCubes.tsx';
import Exp2 from './Glowgrid.tsx';
import Exp3 from './HexaGlow.tsx';
import Exp4 from './HexaGridsSimple.tsx';
import Exp5 from './MaterialSpheres.tsx';
import Exp6 from './NewMouse_1.tsx';
import Exp7 from './WaveGrid.tsx';

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
    id: 'floating-cubes',
    title: 'Floating Cubes',
    description: 'Colorful cubes floating in a circular pattern with smooth animations.',
    component: Exp1,
    category: 'animation',
    difficulty: 'beginner',
    tags: ["animation","cubes"],
  },
  {
    id: 'glowgrid',
    title: 'Glowgrid',
    description: '',
    component: Exp2,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'hexaglow',
    title: 'HexaGlow',
    description: '',
    component: Exp3,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
  {
    id: 'hexa-grids',
    title: 'Hexa Grids',
    description: 'Simple wireframe cube demonstrating basic rotation and materials.',
    component: Exp4,
    category: 'geometry',
    difficulty: 'beginner',
    tags: ["wireframe","rotation"],
  },
  {
    id: 'material-spheres',
    title: 'Material Spheres',
    description: 'Floating spheres with different materials and colors showcasing lighting effects.',
    component: Exp5,
    category: 'materials',
    difficulty: 'beginner',
    tags: ["spheres","materials","lighting","animation"],
  },
  {
    id: 'mouse-follow-glow',
    title: 'Mouse Follow Glow',
    description: 'Mouse-following glowing sphere with bloom and color burst effect.',
    component: Exp6,
    category: 'postprocessing',
    difficulty: 'intermediate',
    tags: ["mouse","bloom","glow","color"],
  },
  {
    id: 'wavegrid',
    title: 'WaveGrid',
    description: '',
    component: Exp7,
    category: 'basics',
    difficulty: 'beginner',
    tags: [],
  },
];

export function getExperimentComponent(id: string) {
  const experiment = experiments.find(exp => exp.id === id);
  return experiment?.component;
}
