/**
 * LengthDisplay Component
 * 
 * Read-only display showing the measured length of a line.
 * Calculates length from line geometry and formats it for display.
 */

import React from 'react';
import type { Line } from '../../../types/drawing.types';
import { getLineLength } from '../../../utils/geometry';
import { formatLength } from '../../../utils/scale';

/**
 * Props for LengthDisplay component
 */
export interface LengthDisplayProps {
  /** Line to display length for */
  line: Line;
  /** Optional CSS class name */
  className?: string;
}

/**
 * LengthDisplay Component
 * 
 * Displays the calculated length of a line in a read-only format.
 * 
 * Features:
 * - Calculates length using getLineLength utility
 * - Formats using formatLength utility
 * - Read-only display (11px gray text)
 * - Shows "(measured)" suffix
 * - Handles both decimal and feet-inches formats
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <LengthDisplay line={selectedLine} />
 * // Displays: "4.3" (measured)" or "4' 3" (measured)"
 * ```
 */
export function LengthDisplay(props: LengthDisplayProps): JSX.Element {
  const { line, className = '' } = props;

  // Calculate length in pixels
  const lengthInPixels = getLineLength(line);

  // Format length (returns string like "4.3"" or "4' 3"")
  const formattedLength = formatLength(lengthInPixels);

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-neutral-600 mb-2">
        Length
      </label>
      <p className="text-xs text-neutral-600" aria-label={`Line length: ${formattedLength} (measured)`}>
        {formattedLength} <span className="text-neutral-500">(measured)</span>
      </p>
    </div>
  );
}

