'use client';

import React, { useMemo } from 'react';

export interface ProgressiveBlurProps {
  direction?: 'top' | 'bottom' | 'both';
  height?: string | number;
  steps?: number;
  maxBlur?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ProgressiveBlur
 * Renders stacked backdrop-filter layers with staggered linear-gradient masks,
 * creating an optical, progressive defocus effect mimicking a camera depth-of-field.
 */
export default function ProgressiveBlur({
  direction = 'bottom',
  height = '220px',
  steps = 8,
  maxBlur = 36,
  className = '',
  style = {},
}: ProgressiveBlurProps) {
  const heightVal = typeof height === 'number' ? `${height}px` : height;

  const layers = useMemo(() => {
    const list: React.ReactNode[] = [];
    for (let i = 0; i < steps; i++) {
      // Exponential / optical blur progression
      const progress = (i + 1) / steps;
      const blurRadius = Math.round(Math.pow(progress, 1.5) * maxBlur * 10) / 10;

      // Mask gradient band for this slice
      const startPct = Math.max(0, (i / steps) * 100);
      const endPct = Math.min(100, ((i + 1.5) / steps) * 100);

      let maskGrad = '';
      if (direction === 'bottom') {
        // Clear at top, fully blurred at bottom
        maskGrad = `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${startPct}%, rgba(0,0,0,1) ${endPct}%, rgba(0,0,0,1) 100%)`;
      } else if (direction === 'top') {
        // Fully blurred at top, clear at bottom
        maskGrad = `linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${startPct}%, rgba(0,0,0,1) ${endPct}%, rgba(0,0,0,1) 100%)`;
      } else {
        // Both: blurred at ends, clear in center
        maskGrad = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)`;
      }

      list.push(
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blurRadius}px)`,
            WebkitBackdropFilter: `blur(${blurRadius}px)`,
            maskImage: maskGrad,
            WebkitMaskImage: maskGrad,
            zIndex: i + 1,
          }}
        />
      );
    }
    return list;
  }, [direction, steps, maxBlur]);

  const positioningStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    height: heightVal,
    pointerEvents: 'none',
    overflow: 'hidden',
    ...(direction === 'top' ? { top: 0 } : direction === 'bottom' ? { bottom: 0 } : { top: 0, bottom: 0 }),
    ...style,
  };

  return (
    <div className={`progressive-blur-container ${className}`} style={positioningStyle}>
      {layers}
    </div>
  );
}
