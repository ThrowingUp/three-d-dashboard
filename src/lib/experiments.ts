import { Experiment, ExperimentCategory } from '@/types/experiments';

export function filterExperimentsByCategory(
  experiments: Experiment[], 
  category: ExperimentCategory
): Experiment[] {
  return experiments.filter(exp => exp.category === category);
}

export function searchExperiments(
  experiments: Experiment[], 
  query: string
): Experiment[] {
  const searchTerm = query.toLowerCase();
  return experiments.filter(exp => 
    exp.title.toLowerCase().includes(searchTerm) ||
    exp.description.toLowerCase().includes(searchTerm) ||
    exp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getExperimentById(
  experiments: Experiment[], 
  id: string
): Experiment | undefined {
  return experiments.find(exp => exp.id === id);
}

export const experimentCategories: { 
  value: ExperimentCategory; 
  label: string; 
  description: string 
}[] = [
  { value: 'basics', label: 'Basics', description: 'Fundamental Three.js concepts' },
  { value: 'materials', label: 'Materials', description: 'Different material types and properties' },
  { value: 'geometry', label: 'Geometry', description: 'Creating and manipulating 3D shapes' },
  { value: 'animation', label: 'Animation', description: 'Motion and transitions' },
  { value: 'lighting', label: 'Lighting', description: 'Illumination and shadows' },
  { value: 'postprocessing', label: 'Post-processing', description: 'Visual effects and filters' },
  { value: 'physics', label: 'Physics', description: 'Physics simulations and interactions' },
  { value: 'shaders', label: 'Shaders', description: 'Custom GLSL shaders' },
];
