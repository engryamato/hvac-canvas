/**
 * WidthChips Component
 * 
 * Quick-select chips for the 5 most common duct widths.
 * Provides fast access to frequently used sizes.
 */

import React from 'react';
import { Chip } from '../shared';
import { QUICK_WIDTH_CHIPS } from '../../../constants/duct.constants';

/**
 * Props for WidthChips component
 */
export interface WidthChipsProps {
  /** Current width value in inches */
  currentWidth: number;
  /** Change handler */
  onWidthChange: (width: number) => void;
  /** Whether chips are disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * WidthChips Component
 * 
 * Displays quick-select chips for the 5 most common duct widths.
 * 
 * Features:
 * - 5 common widths: 6", 8", 10", 12", 14" (from QUICK_WIDTH_CHIPS constant)
 * - Horizontal row with 4px gap
 * - 28px height chips (medium size)
 * - Active chip highlighted blue when matching current width
 * - Click to update width
 * - Uses shared Chip component
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <WidthChips
 *   currentWidth={line.width}
 *   onWidthChange={(width) => updateLine({ width })}
 * />
 * ```
 */
export function WidthChips(props: WidthChipsProps): JSX.Element {
  const { currentWidth, onWidthChange, disabled = false, className = '' } = props;

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Quick width selection">
      {QUICK_WIDTH_CHIPS.map((width) => (
        <Chip
          key={width}
          label={`${width}"`}
          size="medium"
          active={currentWidth === width}
          onClick={() => onWidthChange(width)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

