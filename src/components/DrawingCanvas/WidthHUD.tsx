/**
 * WidthHUD Component
 * 
 * Floating HUD for editing the width of a selected line.
 * Positioned dynamically based on the selected line's location.
 */

import React from 'react';
import type { Line } from '../../types';

/**
 * Props for WidthHUD component
 */
export interface WidthHUDProps {
  /** The currently selected line */
  selectedLine: Line | null;
  /** Position of the HUD (x, y coordinates) */
  position: { x: number; y: number } | null;
  /** Callback when width changes */
  onWidthChange: (newWidth: number) => void;
  /** Reference to the HUD element for positioning calculations */
  hudRef?: React.RefObject<HTMLDivElement>;
}

/**
 * WidthHUD Component
 * 
 * Displays a floating HUD with a slider and numeric display
 * for adjusting the width of the selected line.
 * 
 * Features:
 * - Slider control (1-60px range)
 * - Numeric display of current width
 * - Positioned dynamically above/below selected line
 * - Hidden when no line is selected
 * 
 * @param props - Component props
 * 
 * @example
 * <WidthHUD
 *   selectedLine={selectedLine}
 *   position={{ x: 100, y: 50 }}
 *   onWidthChange={(width) => updateLineWidth(width)}
 *   hudRef={hudRef}
 * />
 */
export function WidthHUD(props: WidthHUDProps): JSX.Element | null {
  const { selectedLine, position, onWidthChange, hudRef } = props;

  // Don't render if no line is selected or no position
  if (!selectedLine || !position) {
    return null;
  }

  return (
    <div
      ref={hudRef}
      className="absolute rounded-2xl shadow-md border border-neutral-200 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      role="dialog"
      aria-label="Line width editor"
    >
      <span className="text-sm text-neutral-600 font-medium">Width</span>
      <input
        type="range"
        min={1}
        max={60}
        value={selectedLine.width}
        onChange={(e) => onWidthChange(Number(e.target.value))}
        className="accent-[var(--color-primary-600)]"
        aria-label="Selected line width"
      />
      <span className="w-12 text-right text-mono tabular-nums text-base text-neutral-900 font-semibold">
        {selectedLine.width}px
      </span>
    </div>
  );
}

