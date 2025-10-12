/**
 * MixedValueDropdown Component
 * 
 * Dropdown for multi-select mode that shows "Mixed" when values differ.
 * Uses getMixedValue service to detect mixed values.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown } from '../shared';
import type { DropdownOption } from '../shared';
import { getMixedValue } from '../../../services/line/LinePropertiesService';
import { ApplyToAllCheckbox } from './ApplyToAllCheckbox';

/**
 * Props for MixedValueDropdown component
 */
export interface MixedValueDropdownProps<T = any> {
  /** Array of values from selected lines */
  values: T[];
  /** Dropdown label */
  label: string;
  /** Dropdown options */
  options: DropdownOption<T>[];
  /** Change handler */
  onChange: (value: T, applyToAll: boolean) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Optional ARIA label */
  ariaLabel?: string;
}

/**
 * MixedValueDropdown Component
 * 
 * A specialized dropdown for multi-select mode with mixed value detection.
 * 
 * Features:
 * - Shows "Mixed" (italic gray text) when values differ across selected lines
 * - Shows actual value when all lines have the same value
 * - Uses getMixedValue service to determine state
 * - Shows ApplyToAllCheckbox below when user changes value
 * - ApplyToAllCheckbox is checked by default
 * - Extends shared Dropdown component
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <MixedValueDropdown
 *   values={selectedLines.map(line => line.type)}
 *   label="Type"
 *   options={[
 *     { label: 'Supply', value: 'supply' },
 *     { label: 'Return', value: 'return' }
 *   ]}
 *   onChange={(type, applyToAll) => {
 *     if (applyToAll) {
 *       updateAllLines({ type });
 *     } else {
 *       updateMatchingLines({ type });
 *     }
 *   }}
 * />
 * ```
 */
export function MixedValueDropdown<T = any>(props: MixedValueDropdownProps<T>): JSX.Element {
  const {
    values,
    label,
    options,
    onChange,
    disabled = false,
    className = '',
    ariaLabel,
  } = props;

  const [showApplyToAll, setShowApplyToAll] = useState(false);
  const [applyToAll, setApplyToAll] = useState(true);
  const [pendingValue, setPendingValue] = useState<T | null>(null);

  // Determine current value using getMixedValue service
  const currentValue = getMixedValue(values);
  const isMixed = currentValue === 'mixed';

  // Reset apply-to-all state when values change externally
  useEffect(() => {
    setShowApplyToAll(false);
    setPendingValue(null);
  }, [values]);

  /**
   * Handle dropdown change
   */
  const handleChange = (newValue: T) => {
    setPendingValue(newValue);
    
    // If values were mixed, show apply-to-all checkbox
    if (isMixed) {
      setShowApplyToAll(true);
      setApplyToAll(true); // Default to checked
    } else {
      // If values were the same, apply immediately
      onChange(newValue, true);
    }
  };

  /**
   * Handle apply-to-all checkbox change
   */
  const handleApplyToAllChange = (checked: boolean) => {
    setApplyToAll(checked);
    
    // Apply the pending value with the new applyToAll setting
    if (pendingValue !== null) {
      onChange(pendingValue, checked);
    }
  };

  // Determine display value
  const displayValue = isMixed ? 'mixed' : currentValue as T;

  // Add "Mixed" option if needed
  const displayOptions: DropdownOption<T | 'mixed'>[] = isMixed
    ? [{ label: 'Mixed', value: 'mixed' }, ...options]
    : options;

  return (
    <div className={className}>
      {/* Dropdown */}
      <Dropdown<T | 'mixed'>
        value={displayValue}
        options={displayOptions}
        onChange={(value) => {
          if (value !== 'mixed') {
            handleChange(value as T);
          }
        }}
        label={label}
        disabled={disabled}
        ariaLabel={ariaLabel}
      />

      {/* Apply to All Checkbox (shown when user changes a mixed value) */}
      {showApplyToAll && (
        <ApplyToAllCheckbox
          checked={applyToAll}
          onChange={handleApplyToAllChange}
          className="mt-1"
        />
      )}
    </div>
  );
}

