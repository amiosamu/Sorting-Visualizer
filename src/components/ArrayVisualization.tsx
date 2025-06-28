'use client';

import React, { useMemo, useEffect, useState, useCallback } from 'react';

interface ArrayVisualizationProps {
  array: number[];
  highlightedIndices: number[];
  highlightType: string;
}

// Memoized component to prevent unnecessary re-renders
const ArrayVisualization = React.memo(function ArrayVisualization({
  array,
  highlightedIndices,
  highlightType
}: ArrayVisualizationProps) {
  const [containerWidth, setContainerWidth] = useState(1200);

  // Convert highlight indices to Set for O(1) lookup performance
  const highlightSet = useMemo(() => new Set(highlightedIndices), [highlightedIndices]);

  // More aggressive debouncing for resize events
  const updateContainerWidth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const newWidth = Math.min(window.innerWidth - 64, 1280);
      setContainerWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    // Set initial width
    updateContainerWidth();

    // More aggressive debouncing to reduce resize calculations
    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      
      // Use requestAnimationFrame for smoother updates
      rafId = requestAnimationFrame(() => {
        timeoutId = setTimeout(updateContainerWidth, 300); // Increased debounce time
      });
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateContainerWidth]);

  // Memoized bar dimensions calculation
  const barDimensions = useMemo(() => {
    const containerPadding = 32;
    const gap = 2;
    const totalGaps = (array.length - 1) * gap;
    const availableWidth = containerWidth - containerPadding;
    const barWidth = Math.max(4, (availableWidth - totalGaps) / array.length);
    
    return { barWidth, gap };
  }, [containerWidth, array.length]);

  // Pre-computed style objects for better performance
  const colorStyles = useMemo(() => ({
    default: { backgroundColor: '#64748b' }, // Modern slate color
    compare: { backgroundColor: '#ef4444' }, // Red for comparisons
    swap: { backgroundColor: '#f59e0b' }, // Amber for swaps
    set: { backgroundColor: '#3b82f6' }, // Blue for sets
    highlight: { backgroundColor: '#8b5cf6' }, // Purple for highlights
    sorted: { backgroundColor: '#10b981' } // Emerald for sorted
  }), []);

  // Optimized style calculator using Set lookup
  const getBarStyle = useCallback((index: number, value: number) => {
    const isHighlighted = highlightSet.has(index);
    let backgroundColor = colorStyles.default.backgroundColor;
    let transform = 'scale(1)';

    if (isHighlighted) {
      switch (highlightType) {
        case 'compare':
          backgroundColor = colorStyles.compare.backgroundColor;
          transform = 'scale(1.05)';
          break;
        case 'swap':
          backgroundColor = colorStyles.swap.backgroundColor;
          transform = 'scale(1.1)';
          break;
        case 'set':
          backgroundColor = colorStyles.set.backgroundColor;
          break;
        case 'highlight':
          backgroundColor = colorStyles.highlight.backgroundColor;
          transform = 'scale(1.05)';
          break;
        case 'sorted':
          backgroundColor = colorStyles.sorted.backgroundColor;
          break;
      }
    }

    return {
      height: `${value}px`,
      width: `${barDimensions.barWidth}px`,
      minWidth: '4px',
      backgroundColor,
      transform,
      transition: isHighlighted ? 'transform 0.15s ease-out' : 'none' // Conditional transitions
    };
  }, [highlightSet, highlightType, colorStyles, barDimensions.barWidth]);

  if (array.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 mb-10 min-h-[500px] flex items-center justify-center border border-white/20 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-600 text-lg font-light">
            Generate an array to begin visualization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 mb-10 min-h-[500px] border border-white/20 shadow-xl">
      <div className="h-full flex items-end justify-center">
        <div 
          className="flex items-end justify-center gap-1"
          style={{ 
            width: '100%',
            maxWidth: `${(barDimensions.barWidth + barDimensions.gap) * array.length}px`,
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        >
          {array.map((value, index) => (
            <div
              key={index}
              className="rounded-t-lg shadow-sm"
              style={getBarStyle(index, value)}
              title={`Index: ${index}, Value: ${value}`}
            />
          ))}
        </div>
      </div>
      
      {/* Modern Legend */}
      <div className="mt-8 pt-6 border-t border-slate-200/50">
        <div className="flex flex-wrap justify-center gap-6">
          <LegendItem color="#64748b" label="Default" />
          <LegendItem color="#ef4444" label="Comparing" />
          <LegendItem color="#f59e0b" label="Swapping" />
          <LegendItem color="#8b5cf6" label="Highlighting" />
          <LegendItem color="#10b981" label="Sorted" />
        </div>
      </div>
    </div>
  );
});

// Memoized legend item component
const LegendItem = React.memo(function LegendItem({ 
  color, 
  label 
}: { 
  color: string; 
  label: string; 
}) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-3 rounded-t-lg shadow-sm" 
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-slate-600 text-sm font-medium">{label}</span>
    </div>
  );
});

export default ArrayVisualization; 