/**
 * AggregateStats Component
 * 
 * Displays aggregate statistics for selected lines in multi-select mode.
 * Shows total length and line count.
 */

import React, { useMemo } from 'react';
import type { Line } from '../../../types/drawing.types';
import { calculateAggregateStats } from '../../../services/line/LinePropertiesService';
import { formatLength } from '../../../utils/scale';

/**
 * Props for AggregateStats component
 */
export interface AggregateStatsProps {
  /** Array of selected lines */
  selectedLines: Line[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * AggregateStats Component
 * 
 * Displays aggregate statistics for multiple selected lines.
 * 
 * Features:
 * - Light blue background (#dbeafe)
 * - 8px padding, 4px border radius
 * - Display format:
 *   - "Total: 14.7"" (sum of all selected line lengths)
 *   - "3 lines" (count with proper pluralization)
 * - 11px text, gray color (#6b7280)
 * - Calculates stats using calculateAggregateStats service
 * - Formats length using formatLength utility
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <AggregateStats
 *   selectedLines={[line1, line2, line3]}
 * />
 * // Displays:
 * // Total: 14.7"
 * // 3 lines
 * ```
 */
export function AggregateStats(props: AggregateStatsProps): JSX.Element {
  const { selectedLines, className = '' } = props;

  /**
   * Calculate aggregate statistics
   */
  const stats = useMemo(() => {
    const lineIds = selectedLines.map((line) => line.id);
    return calculateAggregateStats(selectedLines, lineIds);
  }, [selectedLines]);

  // Format total length
  const formattedTotal = formatLength(stats.totalLength);

  // Proper pluralization for line count
  const countText = stats.count === 1 ? '1 line' : `${stats.count} lines`;

  return (
    <div
      className={`bg-blue-50 rounded p-2 ${className}`}
      role="region"
      aria-label="Aggregate statistics"
    >
      <div className="space-y-0.5 text-xs text-neutral-600">
        {/* Total Length */}
        <div>
          <span className="font-medium">Total:</span> {formattedTotal}
        </div>

        {/* Line Count */}
        <div>{countText}</div>
      </div>
    </div>
  );
}

