/**
 * WarningBanner Component
 * 
 * Warning banner displayed when velocity exceeds recommended maximum (1500 fpm).
 * Shows warning message and suggests optimal width to reduce velocity.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { suggestOptimalWidth, formatCalculationResult } from '../../../utils/hvac/calculations';

/**
 * Props for WarningBanner component
 */
export interface WarningBannerProps {
  /** Current velocity in fpm */
  velocity: number;
  /** Current duct width in inches */
  currentWidth: number;
  /** Current airflow in CFM */
  cfm: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * WarningBanner Component
 * 
 * Displays a warning when velocity exceeds 1500 fpm with width suggestion.
 * 
 * Features:
 * - Amber background (#fef3c7)
 * - Amber border (#fbbf24)
 * - 12px padding, 8px border radius
 * - 11px text
 * - Warning icon (AlertTriangle from lucide-react)
 * - Two-line format:
 *   - Line 1: "⚠️ High velocity (1,650 fpm)"
 *   - Line 2: "Suggest: 10" to reduce velocity"
 * - Only shown when velocity > 1500 fpm
 * - Calculates suggestion using suggestOptimalWidth utility
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * {velocity > 1500 && (
 *   <WarningBanner
 *     velocity={1650}
 *     currentWidth={8}
 *     cfm={500}
 *   />
 * )}
 * // Displays:
 * // ⚠️ High velocity (1,650 fpm)
 * // Suggest: 10" to reduce velocity
 * ```
 */
export function WarningBanner(props: WarningBannerProps): JSX.Element | null {
  const { velocity, currentWidth, cfm, className = '' } = props;

  // Only show if velocity exceeds 1500 fpm
  if (velocity <= 1500) {
    return null;
  }

  // Calculate suggested width
  const suggestedWidth = suggestOptimalWidth(currentWidth, velocity, 1500);

  // Format velocity for display
  const formattedVelocity = formatCalculationResult(velocity, 'fpm', 0);

  return (
    <div
      className={`bg-amber-50 border border-amber-400 rounded-lg p-3 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        {/* Warning Icon */}
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />

        {/* Warning Content */}
        <div className="flex-1 text-xs text-amber-900">
          {/* Line 1: High velocity message */}
          <p className="font-semibold">
            High velocity ({formattedVelocity})
          </p>

          {/* Line 2: Suggestion */}
          {suggestedWidth && (
            <p className="mt-1">
              Suggest: {suggestedWidth}" to reduce velocity
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

