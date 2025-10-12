/**
 * ResultRow Component
 * 
 * Displays a single calculation result with label, value, unit, and status icon.
 * Used in ResultsDisplay to show Velocity, Friction, and Pressure calculations.
 */

import React from 'react';
import { StatusIcon } from '../shared';
import type { StatusType } from '../shared';
import { formatCalculationResult } from '../../../utils/hvac/calculations';

/**
 * Props for ResultRow component
 */
export interface ResultRowProps {
  /** Result label (e.g., "Velocity", "Friction", "Pressure") */
  label: string;
  /** Numeric value to display */
  value: number;
  /** Unit of measurement (e.g., "fpm", "in.wc/100ft", "in") */
  unit: string;
  /** Status type for icon (success, warning, error, info) */
  status?: StatusType;
  /** Number of decimal places (default: 0) */
  precision?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ResultRow Component
 * 
 * Displays a formatted calculation result with status indicator.
 * 
 * Features:
 * - 28px height, flex layout
 * - Label: 12px medium gray text
 * - Value: 14px semibold text
 * - Unit: 14px regular text
 * - Status icon: 14px (✓ green for success, ⚠️ amber for warning)
 * - Formats value using formatCalculationResult utility
 * - Accessible with proper ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Velocity result (acceptable)
 * <ResultRow
 *   label="Velocity"
 *   value={1432}
 *   unit="fpm"
 *   status="success"
 *   precision={0}
 * />
 * // Displays: "Velocity  1,432 fpm ✓"
 * 
 * // Velocity result (warning)
 * <ResultRow
 *   label="Velocity"
 *   value={1650}
 *   unit="fpm"
 *   status="warning"
 *   precision={0}
 * />
 * // Displays: "Velocity  1,650 fpm ⚠️"
 * ```
 */
export function ResultRow(props: ResultRowProps): JSX.Element {
  const {
    label,
    value,
    unit,
    status,
    precision = 0,
    className = '',
  } = props;

  // Format the value using the utility
  const formattedValue = formatCalculationResult(value, unit, precision);

  return (
    <div
      className={`flex items-center justify-between h-7 ${className}`}
      role="row"
      aria-label={`${label}: ${formattedValue}`}
    >
      {/* Label */}
      <span className="text-xs font-medium text-neutral-600">
        {label}
      </span>

      {/* Value, Unit, and Status Icon */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-900">
          {formattedValue}
        </span>
        {status && (
          <StatusIcon
            status={status}
            size={14}
            ariaLabel={`${label} status: ${status}`}
          />
        )}
      </div>
    </div>
  );
}

