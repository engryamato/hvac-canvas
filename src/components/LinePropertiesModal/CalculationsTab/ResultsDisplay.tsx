/**
 * ResultsDisplay Component
 * 
 * Container for displaying all HVAC calculation results.
 * Shows Velocity, Friction, and Pressure with status indicators.
 */

import React from 'react';
import { Zap } from 'lucide-react';
import { Section } from '../shared';
import { ResultRow } from './ResultRow';
import type { StatusType } from '../shared';

/**
 * Calculation results data
 */
export interface CalculationResults {
  /** Velocity in feet per minute (fpm) */
  velocity: number;
  /** Friction loss in inches water column per 100 feet (in.wc/100ft) */
  friction: number;
  /** Velocity pressure in inches of water (in) */
  pressure: number;
}

/**
 * Props for ResultsDisplay component
 */
export interface ResultsDisplayProps {
  /** Calculation results to display */
  results: CalculationResults;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ResultsDisplay Component
 * 
 * Displays all HVAC calculation results in a styled container.
 * 
 * Features:
 * - Light gray background (#f3f4f6)
 * - 12px padding, 4px border radius
 * - Section header with lightning icon (Zap)
 * - Three ResultRow components:
 *   - Velocity (fpm) - success if ≤ 1500, warning if > 1500
 *   - Friction (in.wc/100ft) - 2 decimal places
 *   - Pressure (in) - 2 decimal places
 * - Uses Section component for consistent styling
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ResultsDisplay
 *   results={{
 *     velocity: 1432,
 *     friction: 0.084,
 *     pressure: 0.128
 *   }}
 * />
 * ```
 */
export function ResultsDisplay(props: ResultsDisplayProps): JSX.Element {
  const { results, className = '' } = props;

  // Determine velocity status (success if ≤ 1500 fpm, warning if > 1500)
  const velocityStatus: StatusType = results.velocity <= 1500 ? 'success' : 'warning';

  return (
    <div
      className={`bg-neutral-100 rounded p-3 ${className}`}
      role="region"
      aria-label="Calculation results"
      aria-live="polite"
      aria-atomic="true"
    >
      <Section
        title="Results"
        icon={<Zap className="w-3 h-3" />}
      >
        {/* Velocity Result */}
        <ResultRow
          label="Velocity"
          value={results.velocity}
          unit="fpm"
          status={velocityStatus}
          precision={0}
        />

        {/* Friction Result */}
        <ResultRow
          label="Friction"
          value={results.friction}
          unit="in.wc/100ft"
          precision={2}
        />

        {/* Pressure Result */}
        <ResultRow
          label="Pressure"
          value={results.pressure}
          unit="in"
          precision={2}
        />
      </Section>
    </div>
  );
}

