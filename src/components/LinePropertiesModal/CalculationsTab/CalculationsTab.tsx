/**
 * CalculationsTab Component
 * 
 * Main Calculations tab component that handles HVAC calculations.
 * Displays airflow input, calculation results, and warnings.
 */

import React, { useMemo } from 'react';
import type { Line } from '../../../types/drawing.types';
import { AirflowInput } from './AirflowInput';
import { ResultsDisplay } from './ResultsDisplay';
import type { CalculationResults } from './ResultsDisplay';
import { WarningBanner } from './WarningBanner';
import {
  calculateVelocity,
  calculateFriction,
  calculatePressure,
} from '../../../utils/hvac/calculations';
import { getLineLength } from '../../../utils/geometry';

/**
 * Props for CalculationsTab component
 */
export interface CalculationsTabProps {
  /** Line being analyzed */
  line: Line;
  /** Update handler for line properties */
  onUpdate: (updates: Partial<Line>) => void;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * CalculationsTab Component
 * 
 * The main Calculations tab that displays HVAC calculations and warnings.
 * 
 * Features:
 * - Airflow input (CFM)
 * - Real-time calculation of:
 *   - Velocity (fpm) using calculateVelocity
 *   - Friction (in.wc/100ft) using calculateFriction
 *   - Pressure (in) using calculatePressure
 * - Results display with status indicators
 * - Warning banner when velocity > 1500 fpm
 * - Width suggestion for high velocity
 * - 320px height
 * - Proper spacing and layout per wireframes
 * 
 * Calculation Flow:
 * 1. User enters airflow (CFM)
 * 2. Calculate velocity = (CFM × 144) / (width² × π/4)
 * 3. Calculate friction using Wright equation
 * 4. Calculate pressure = (velocity / 4005)²
 * 5. Validate results (check if velocity > 1500 fpm)
 * 6. Show warning banner with width suggestion if needed
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <CalculationsTab
 *   line={selectedLine}
 *   onUpdate={(updates) => updateLineProperties(selectedLine, updates)}
 * />
 * ```
 */
export function CalculationsTab(props: CalculationsTabProps): JSX.Element {
  const { line, onUpdate, disabled = false, className = '' } = props;

  /**
   * Calculate line length in inches
   */
  const lineLength = useMemo(() => {
    return getLineLength(line);
  }, [line]);

  /**
   * Calculate all HVAC values
   */
  const results: CalculationResults = useMemo(() => {
    const cfm = line.airflow || 0;
    const width = line.width;

    // Calculate velocity
    const velocity = calculateVelocity(cfm, width);

    // Calculate friction (requires velocity, width, and length)
    const friction = calculateFriction(velocity, width, lineLength);

    // Calculate pressure
    const pressure = calculatePressure(velocity);

    return {
      velocity,
      friction,
      pressure,
    };
  }, [line.airflow, line.width, lineLength]);

  /**
   * Handle airflow change
   */
  const handleAirflowChange = (airflow: number) => {
    onUpdate({ airflow });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Airflow Input */}
      <AirflowInput
        value={line.airflow || 0}
        onChange={handleAirflowChange}
        disabled={disabled}
      />

      {/* Results Display */}
      <ResultsDisplay results={results} />

      {/* Warning Banner (only shown when velocity > 1500 fpm) */}
      <WarningBanner
        velocity={results.velocity}
        currentWidth={line.width}
        cfm={line.airflow || 0}
      />
    </div>
  );
}

