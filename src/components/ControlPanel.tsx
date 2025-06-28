'use client';

import React from 'react';
import { SortingAlgorithm, VisualizationState, AlgorithmInfo } from '@/types/sorting';

interface ControlPanelProps {
  algorithms: AlgorithmInfo[];
  state: VisualizationState;
  onAlgorithmSelect: (algorithm: SortingAlgorithm) => void;
  onGenerateArray: () => void;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlPanel = React.memo(function ControlPanel({
  algorithms,
  state,
  onAlgorithmSelect,
  onGenerateArray,
  onArraySizeChange,
  onSpeedChange,
  onStart,
  onPause,
  onReset
}: ControlPanelProps) {
  const canStart = state.selectedAlgorithm && !state.isAnimating;
  const canPause = state.isAnimating;
  const canReset = !state.isAnimating || state.isPaused;
  const canModifyArray = !state.isAnimating || state.isPaused;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-10 shadow-xl border border-white/20">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Algorithm Selection */}
        <div className="lg:col-span-2">
          <label className="block text-slate-800 font-medium mb-6 text-lg">
            Algorithm
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {algorithms.map((algorithm) => (
              <AlgorithmButton
                key={algorithm.id}
                algorithm={algorithm}
                isSelected={state.selectedAlgorithm === algorithm.id}
                isDisabled={state.isAnimating && !state.isPaused}
                onClick={() => onAlgorithmSelect(algorithm.id)}
              />
            ))}
          </div>
        </div>

        {/* Array Controls */}
        <div>
          <label className="block text-slate-800 font-medium mb-6 text-lg">
            Array
          </label>
          <div className="space-y-5">
            <button
              onClick={onGenerateArray}
              disabled={!canModifyArray}
              className={`
                w-full px-6 py-3 rounded-2xl font-medium transition-all duration-200
                ${canModifyArray
                  ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              Generate Array
            </button>
            
            <RangeSlider
              label="Size"
              value={state.arraySize}
              min={10}
              max={100}
              onChange={onArraySizeChange}
              disabled={!canModifyArray}
              color="#334155"
            />
          </div>
        </div>

        {/* Speed Control & Playback */}
        <div>
          <label className="block text-slate-800 font-medium mb-6 text-lg">
            Controls
          </label>
          
          {/* Speed Control */}
          <div className="mb-6">
            <RangeSlider
              label="Speed"
              value={state.speed}
              min={1}
              max={100}
              onChange={onSpeedChange}
              disabled={false}
              color="#334155"
            />
          </div>

          {/* Playback Controls */}
          <div className="space-y-3">
            <PlaybackButton
              onClick={onStart}
              disabled={!canStart}
              variant="start"
            >
              Start
            </PlaybackButton>
            
            <PlaybackButton
              onClick={onPause}
              disabled={!canPause}
              variant="pause"
            >
              {state.isPaused ? 'Resume' : 'Pause'}
            </PlaybackButton>
            
            <PlaybackButton
              onClick={onReset}
              disabled={!canReset}
              variant="reset"
            >
              Reset
            </PlaybackButton>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar algorithms={algorithms} state={state} />
    </div>
  );
});

// Memoized Algorithm Button Component
const AlgorithmButton = React.memo(function AlgorithmButton({
  algorithm,
  isSelected,
  isDisabled,
  onClick
}: {
  algorithm: AlgorithmInfo;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200
        ${isSelected
          ? 'bg-slate-800 text-white shadow-lg ring-2 ring-slate-300'
          : 'bg-white/50 text-slate-700 hover:bg-white/70 hover:shadow-md'
        }
        ${isDisabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer'
        }
      `}
    >
      {algorithm.name}
    </button>
  );
});

// Memoized Range Slider Component
const RangeSlider = React.memo(function RangeSlider({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
  color
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled: boolean;
  color: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-slate-600 text-sm font-medium">
        <span>{label}</span>
        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-800 font-semibold">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className={`
            w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
            slider-thumb
          `}
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
      </div>
    </div>
  );
});

// Memoized Playback Button Component
const PlaybackButton = React.memo(function PlaybackButton({
  onClick,
  disabled,
  variant,
  children
}: {
  onClick: () => void;
  disabled: boolean;
  variant: 'start' | 'pause' | 'reset';
  children: React.ReactNode;
}) {
  const getVariantClasses = () => {
    if (disabled) return 'bg-slate-200 text-slate-400 cursor-not-allowed';
    
    switch (variant) {
      case 'start':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl';
      case 'pause':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl';
      case 'reset':
        return 'bg-slate-500 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-slate-200 text-slate-400';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-6 py-3 rounded-2xl font-medium transition-all duration-200
        ${getVariantClasses()}
      `}
    >
      {children}
    </button>
  );
});

// Memoized Status Bar Component
const StatusBar = React.memo(function StatusBar({
  algorithms,
  state
}: {
  algorithms: AlgorithmInfo[];
  state: VisualizationState;
}) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-50 rounded-xl p-3">
          <span className="text-slate-500 block mb-1">Algorithm</span>
          <span className="font-semibold text-slate-800">
            {state.selectedAlgorithm 
              ? algorithms.find(a => a.id === state.selectedAlgorithm)?.name || 'None'
              : 'Not selected'
            }
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <span className="text-slate-500 block mb-1">Array Size</span>
          <span className="font-semibold text-slate-800">{state.arraySize}</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <span className="text-slate-500 block mb-1">Status</span>
          <span className={`font-semibold capitalize ${
            state.status === 'completed' ? 'text-emerald-600' :
            state.status === 'sorting' ? 'text-blue-600' :
            state.status === 'paused' ? 'text-amber-600' :
            'text-slate-600'
          }`}>
            {state.status}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ControlPanel; 