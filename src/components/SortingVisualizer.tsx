'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SortingAlgorithm, SortingStep, VisualizationState, AlgorithmInfo } from '@/types/sorting';
import ArrayVisualization from './ArrayVisualization';
import ControlPanel from './ControlPanel';

const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)'
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)'
  }
];

export default function SortingVisualizer() {
  const [state, setState] = useState<VisualizationState>({
    array: [],
    isAnimating: false,
    isPaused: false,
    currentStep: 0,
    selectedAlgorithm: null,
    arraySize: 50,
    speed: 50,
    status: 'ready'
  });

  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [highlightType, setHighlightType] = useState<string>('');
  
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);
  const isPausedRef = useRef(false);
  const speedRef = useRef(50);

  // Generate random array - simplified to avoid triggering on animation state changes
  const generateRandomArray = useCallback(() => {
    // Check if currently animating using ref to avoid dependency
    if (isAnimatingRef.current && !isPausedRef.current) return;
    
    const newArray: number[] = [];
    const maxHeight = 300;
    
    for (let i = 0; i < state.arraySize; i++) {
      newArray.push(Math.floor(Math.random() * maxHeight) + 10);
    }
    
    setState(prev => ({
      ...prev,
      array: newArray,
      status: 'ready'
    }));
    
    setHighlightedIndices([]);
    setHighlightType('');
  }, [state.arraySize]);

  // Initialize array on component mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    isPausedRef.current = state.isPaused;
    speedRef.current = state.speed;
  }, [state.isPaused, state.speed]);

  // Update array when size changes - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateRandomArray();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [state.arraySize]);

  // PLACEHOLDER ALGORITHM IMPLEMENTATIONS - TO BE REPLACED
  const bubbleSortSteps = useCallback((array: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        steps.push({
          type: 'compare',
          indices: [j, j + 1]
        });

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          steps.push({
            type: 'swap',
            indices: [j, j + 1]
          });
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
        }
      }

      // Mark the last element as sorted (it's in its final position)
      steps.push({
        type: 'sorted',
        indices: [n - i - 1]
      });

      // If no swapping occurred, the array is sorted
      if (!swapped) {
        // Mark all remaining elements as sorted
        for (let k = 0; k < n - i - 1; k++) {
          steps.push({
            type: 'sorted',
            indices: [k]
          });
        }
        break;
      }
    }

    return steps;
  }, []);


  const selectionSortSteps = useCallback((array: number[]): SortingStep[] => {  
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      // Highlight the current starting position
      steps.push({
        type: 'highlight',
        indices: [i]
      });

      // Find the minimum element in the remaining unsorted array
      for (let j = i + 1; j < n; j++) {
        // Compare current element with current minimum
        steps.push({
          type: 'compare',
          indices: [minIndex, j]
        });

        // If we found a smaller element, update minIndex
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          // Highlight the new minimum
          steps.push({
            type: 'highlight',
            indices: [minIndex]
          });
        }
      }

      // Swap the found minimum element with the first element of unsorted part
      if (minIndex !== i) {
        steps.push({
          type: 'swap',
          indices: [i, minIndex]
        });
        
        // Perform the swap in our tracking array
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }

      // Mark the current position as sorted
      steps.push({
        type: 'sorted',
        indices: [i]
      });
    }

    // Mark the last element as sorted (it's automatically in place)
    steps.push({
      type: 'sorted',
      indices: [n - 1]
    });

    return steps;
  }, []);

  const insertionSortSteps = useCallback((array: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    // First element is considered sorted
    steps.push({
      type: 'sorted',
      indices: [0]
    });

    // Start from the second element
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      
      // Highlight the current element being inserted (the key)
      steps.push({
        type: 'highlight',
        indices: [i]
      });

      // Move elements of arr[0..i-1], that are greater than key,
      // one position ahead of their current position
      while (j >= 0 && arr[j] > key) {
        // Compare the key with element at position j
        steps.push({
          type: 'compare',
          indices: [j, i]
        });

        // Shift the larger element one position to the right
        steps.push({
          type: 'swap',
          indices: [j, j + 1]
        });
        
        // Perform the shift in our tracking array
        arr[j + 1] = arr[j];
        j--;
      }

      // If we didn't exit the loop due to j < 0, we need one final comparison
      if (j >= 0) {
        steps.push({
          type: 'compare',
          indices: [j, i]
        });
      }

      // Insert the key at its correct position
      arr[j + 1] = key;
      
      // Show the key being placed in its correct position
      steps.push({
        type: 'set',
        indices: [j + 1],
        values: [key]
      });

      // Mark all elements from 0 to i as sorted
      for (let k = 0; k <= i; k++) {
        steps.push({
          type: 'sorted',
          indices: [k]
        });
      }
    }

    return steps;
  }, []);


  const mergeSortSteps = useCallback((array: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    // Helper function for merging two sorted subarrays
    const merge = (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      // Highlight the subarrays being merged
      steps.push({
        type: 'highlight',
        indices: Array.from({length: right - left + 1}, (_, idx) => left + idx)
      });

      // Merge the two sorted subarrays
      while (i < leftArr.length && j < rightArr.length) {
        // Compare elements from both subarrays
        steps.push({
          type: 'compare',
          indices: [left + i, mid + 1 + j]
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          steps.push({
            type: 'set',
            indices: [k],
            values: [leftArr[i]]
          });
          i++;
        } else {
          arr[k] = rightArr[j];
          steps.push({
            type: 'set',
            indices: [k],
            values: [rightArr[j]]
          });
          j++;
        }
        k++;
      }

      // Copy remaining elements from left subarray
      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'set',
          indices: [k],
          values: [leftArr[i]]
        });
        i++;
        k++;
      }

      // Copy remaining elements from right subarray
      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
          type: 'set',
          indices: [k],
          values: [rightArr[j]]
        });
        j++;
        k++;
      }

      // Mark the merged portion as sorted temporarily
      steps.push({
        type: 'sorted',
        indices: Array.from({length: right - left + 1}, (_, idx) => left + idx)
      });
    };

    // Recursive merge sort function
    const mergeSort = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Recursively sort left and right halves
        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        
        // Merge the sorted halves
        merge(left, mid, right);
      }
    };

    // Start the sorting process
    mergeSort(0, n - 1);

    // Mark all elements as finally sorted
    steps.push({
      type: 'sorted',
      indices: Array.from({length: n}, (_, i) => i)
    });

    return steps;
  }, []);

  const quickSortSteps = useCallback((array: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    // Helper function to partition the array
    const partition = (low: number, high: number): number => {
      // Choose the rightmost element as pivot
      const pivot = arr[high];
      
      // Highlight the pivot
      steps.push({
        type: 'highlight',
        indices: [high]
      });

      let i = low - 1; // Index of smaller element

      for (let j = low; j < high; j++) {
        // Compare current element with pivot
        steps.push({
          type: 'compare',
          indices: [j, high]
        });

        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
          i++;
          
          // Swap elements if they're different
          if (i !== j) {
            steps.push({
              type: 'swap',
              indices: [i, j]
            });
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
      }

      // Place pivot in its correct position
      if (i + 1 !== high) {
        steps.push({
          type: 'swap',
          indices: [i + 1, high]
        });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      }

      // Mark the pivot as in its final position
      steps.push({
        type: 'sorted',
        indices: [i + 1]
      });

      return i + 1;
    };

    // Recursive quick sort function
    const quickSort = (low: number, high: number) => {
      if (low < high) {
        // Partition the array and get the pivot index
        const pivotIndex = partition(low, high);
        
        // Recursively sort elements before and after partition
        quickSort(low, pivotIndex - 1);
        quickSort(pivotIndex + 1, high);
      } else if (low === high) {
        // Single element is already sorted
        steps.push({
          type: 'sorted',
          indices: [low]
        });
      }
    };

    // Start the sorting process
    quickSort(0, n - 1);

    // Mark all elements as finally sorted
    steps.push({
      type: 'sorted',
      indices: Array.from({length: n}, (_, i) => i)
    });

    return steps;
  }, []);

  const heapSortSteps = useCallback((array: number[]): SortingStep[] => {
    const steps: SortingStep[] = [];
    const arr = [...array];
    const n = arr.length;

    // Helper function to heapify a subtree rooted at index i
    const heapify = (heapSize: number, i: number) => {
      let largest = i; // Initialize largest as root
      const left = 2 * i + 1; // Left child
      const right = 2 * i + 2; // Right child

      // Highlight the current node being heapified
      steps.push({
        type: 'highlight',
        indices: [i]
      });

      // If left child exists and is greater than root
      if (left < heapSize) {
        steps.push({
          type: 'compare',
          indices: [left, largest]
        });
        
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      // If right child exists and is greater than largest so far
      if (right < heapSize) {
        steps.push({
          type: 'compare',
          indices: [right, largest]
        });
        
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      // If largest is not root
      if (largest !== i) {
        // Swap root with largest
        steps.push({
          type: 'swap',
          indices: [i, largest]
        });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Recursively heapify the affected sub-tree
        heapify(heapSize, largest);
      }
    };

    // Build max heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Show that heap is built
    steps.push({
      type: 'highlight',
      indices: Array.from({length: n}, (_, i) => i)
    });

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end (largest element to its final position)
      steps.push({
        type: 'swap',
        indices: [0, i]
      });
      [arr[0], arr[i]] = [arr[i], arr[0]];

      // Mark the element as sorted
      steps.push({
        type: 'sorted',
        indices: [i]
      });

      // Call heapify on the reduced heap
      heapify(i, 0);
    }

    // Mark the first element as sorted (it's the smallest)
    steps.push({
      type: 'sorted',
      indices: [0]
    });

    // Mark all elements as finally sorted
    steps.push({
      type: 'sorted',
      indices: Array.from({length: n}, (_, i) => i)
    });

    return steps;
  }, []);

  // Placeholder sorting algorithm implementations
  const generateSortingSteps = useCallback((algorithm: SortingAlgorithm, array: number[]): SortingStep[] => {
    switch (algorithm) {
      case 'bubble-sort':
        return bubbleSortSteps(array);
      case 'selection-sort':
        return selectionSortSteps(array);
      case 'insertion-sort':
        return insertionSortSteps(array);
      case 'merge-sort':
        return mergeSortSteps(array);
      case 'quick-sort':
        return quickSortSteps(array);
      case 'heap-sort':
        return heapSortSteps(array);
      default:
        return [];
    }
  }, [bubbleSortSteps, selectionSortSteps, insertionSortSteps, mergeSortSteps, quickSortSteps, heapSortSteps]);

  const executeStep = useCallback(async (step: SortingStep) => {
    setHighlightedIndices(step.indices);
    setHighlightType(step.type);

    switch (step.type) {
      case 'swap':
        if (step.indices.length === 2) {
          const [i, j] = step.indices;
          setState(prev => {
            const newArray = [...prev.array];
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            return { ...prev, array: newArray };
          });
        }
        break;
      case 'set':
        if (step.values && step.indices.length === step.values.length) {
          setState(prev => {
            const newArray = [...prev.array];
            step.indices.forEach((index, i) => {
              newArray[index] = step.values![i];
            });
            return { ...prev, array: newArray };
          });
        }
        break;
    }
  }, []);

  // Optimized animation logic with better performance
  const animateSteps = useCallback(async (steps: SortingStep[]) => {
    isAnimatingRef.current = true;
    let lastUpdateTime = 0;
    
    for (let i = 0; i < steps.length; i++) {
      // Check if animation should continue
      if (!isAnimatingRef.current) break;
      
      // Wait if paused - use ref for real-time pause state
      while (isPausedRef.current && isAnimatingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!isAnimatingRef.current) break;

      await executeStep(steps[i]);
      
      // Throttle state updates to avoid too frequent re-renders
      const now = Date.now();
      if (now - lastUpdateTime > 16) { // ~60fps max
        setState(prev => ({ ...prev, currentStep: i + 1 }));
        lastUpdateTime = now;
      }
      
      // Calculate delay based on speed - use ref for real-time speed
      const delay = Math.max(8, 105 - speedRef.current); // Minimum 8ms delay
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, delay);
      });
    }

    // Finish animation
    if (isAnimatingRef.current) {
      setState(prev => ({
        ...prev,
        isAnimating: false,
        isPaused: false,
        status: 'completed'
      }));
      
      // Highlight all as sorted
      setHighlightedIndices(Array.from({ length: state.array.length }, (_, i) => i));
      setHighlightType('sorted');
      isAnimatingRef.current = false;
    }
  }, [executeStep]);

  // Algorithm selection - optimized
  const selectAlgorithm = useCallback((algorithm: SortingAlgorithm) => {
    if (state.isAnimating) return;
    
    setState(prev => ({
      ...prev,
      selectedAlgorithm: algorithm,
      status: 'ready'
    }));
  }, [state.isAnimating]);

  // Control functions - optimized
  const updateArraySize = useCallback((size: number) => {
    setState(prev => ({ ...prev, arraySize: size }));
  }, []);

  const updateSpeed = useCallback((speed: number) => {
    speedRef.current = speed; // Update ref immediately
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Animation control - optimized
  const startSorting = useCallback(async () => {
    if (!state.selectedAlgorithm || state.isAnimating) return;

    const steps = generateSortingSteps(state.selectedAlgorithm, [...state.array]);
    
    setState(prev => ({
      ...prev,
      isAnimating: true,
      isPaused: false,
      currentStep: 0,
      status: 'sorting'
    }));

    await animateSteps(steps);
  }, [state.selectedAlgorithm, state.isAnimating, state.array, animateSteps, generateSortingSteps]);

  const pauseSorting = useCallback(() => {
    setState(prev => {
      const newPausedState = !prev.isPaused;
      isPausedRef.current = newPausedState; // Update ref immediately
      return {
        ...prev,
        isPaused: newPausedState,
        status: newPausedState ? 'paused' : 'sorting'
      };
    });
  }, []);

  const resetSorting = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isAnimatingRef.current = false;
    
    setState(prev => ({
      ...prev,
      isAnimating: false,
      isPaused: false,
      currentStep: 0,
      status: 'ready'
    }));
    
    setHighlightedIndices([]);
    setHighlightType('');
  }, []);

  // Memoized algorithm info to prevent unnecessary lookups
  const selectedAlgorithmInfo = useMemo(
    () => ALGORITHMS.find(alg => alg.id === state.selectedAlgorithm),
    [state.selectedAlgorithm]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-thin text-slate-800 mb-6 tracking-tight">
            Sorting Visualizer
          </h1>
          <p className="text-slate-600 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Experience the elegance of sorting algorithms through interactive visualization
          </p>
        </header>

        <ControlPanel
          algorithms={ALGORITHMS}
          state={state}
          onAlgorithmSelect={selectAlgorithm}
          onGenerateArray={generateRandomArray}
          onArraySizeChange={updateArraySize}
          onSpeedChange={updateSpeed}
          onStart={startSorting}
          onPause={pauseSorting}
          onReset={resetSorting}
        />

        <ArrayVisualization
          array={state.array}
          highlightedIndices={highlightedIndices}
          highlightType={highlightType}
        />

        {selectedAlgorithmInfo && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mt-6 border border-white/20 shadow-xl">
            <h3 className="text-slate-800 text-2xl font-light mb-6 text-center">
              {selectedAlgorithmInfo.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="text-slate-700 font-semibold mb-4 text-lg">Time Complexity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Best Case:</span>
                    <code className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-mono">
                      {selectedAlgorithmInfo.timeComplexity.best}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average:</span>
                    <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                      {selectedAlgorithmInfo.timeComplexity.average}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Worst Case:</span>
                    <code className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-mono">
                      {selectedAlgorithmInfo.timeComplexity.worst}
                    </code>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="text-slate-700 font-semibold mb-4 text-lg">Space Complexity</h4>
                <div className="flex justify-center">
                  <code className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-lg font-mono">
                    {selectedAlgorithmInfo.spaceComplexity}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 