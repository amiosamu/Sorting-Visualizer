export type SortingAlgorithm = 
  | 'bubble-sort' 
  | 'selection-sort' 
  | 'insertion-sort' 
  | 'merge-sort' 
  | 'quick-sort' 
  | 'heap-sort';

export interface SortingStep {
  type: 'compare' | 'swap' | 'set' | 'highlight' | 'sorted';
  indices: number[];
  values?: number[];
}

export interface AlgorithmInfo {
  id: SortingAlgorithm;
  name: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}

export interface VisualizationState {
  array: number[];
  isAnimating: boolean;
  isPaused: boolean;
  currentStep: number;
  selectedAlgorithm: SortingAlgorithm | null;
  arraySize: number;
  speed: number;
  status: 'ready' | 'sorting' | 'paused' | 'completed';
} 