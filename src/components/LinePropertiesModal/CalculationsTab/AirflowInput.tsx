/**
 * AirflowInput Component
 * 
 * Number input for entering airflow (CFM) value.
 * Used in Calculations tab for HVAC calculations.
 */

import React from 'react';
import { Input } from '../shared';

/**
 * Props for AirflowInput component
 */
export interface AirflowInputProps {
  /** Current airflow value in CFM */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * AirflowInput Component
 * 
 * A specialized number input for airflow (CFM) entry.
 * 
 * Features:
 * - Number input with validation
 * - Minimum value: 0 (non-negative)
 * - Step: 1 (whole numbers)
 * - 32px height
 * - Label: "Airflow (CFM)"
 * - Uses shared Input component
 * - Validation state for negative values
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <AirflowInput
 *   value={line.airflow}
 *   onChange={(cfm) => updateLine({ airflow: cfm })}
 * />
 * ```
 */
export function AirflowInput(props: AirflowInputProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  /**
   * Handle input change
   */
  const handleChange = (newValue: string | number) => {
    const numValue = typeof newValue === 'string' ? Number(newValue) : newValue;
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  // Determine validation state
  const validationState = value < 0 ? 'error' : 'default';
  const helperText = value < 0 ? 'Airflow cannot be negative' : '';

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      label="Airflow (CFM)"
      min={0}
      step={1}
      validationState={validationState}
      helperText={helperText}
      disabled={disabled}
      className={className}
      ariaLabel="Airflow in cubic feet per minute"
    />
  );
}

