export interface Experiment {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category: ExperimentCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export type ExperimentCategory = 
  | 'basics'
  | 'materials'
  | 'geometry'
  | 'animation'
  | 'lighting'
  | 'postprocessing'
  | 'physics'
  | 'shaders';

export interface ExperimentNavigationProps {
  experiments: Experiment[];
  currentExperiment?: string;
  onExperimentSelect: (experimentId: string) => void;
}
