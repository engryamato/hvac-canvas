/**
 * WidthDropdown Component
 * 
 * Dropdown for selecting duct width from standard sizes (4-40 inches).
 * Includes a "Custom..." option for non-standard widths.
 */

import React, { useState } from 'react';
import { Dropdown } from '../shared';
import type { DropdownOption } from '../shared';
import { STANDARD_WIDTHS } from '../../../constants/duct.constants';

/**
 * Props for WidthDropdown component
 */
export interface WidthDropdownProps {
  /** Current width value in inches */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * WidthDropdown Component
 * 
 * A specialized dropdown for selecting duct width with standard sizes.
 * 
 * Features:
 * - Standard widths from 4" to 40" (even numbers)
 * - Scrollable menu (max 224px height, ~7 items visible)
 * - "Custom..." option at bottom for non-standard widths
 * - Uses shared Dropdown component
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <WidthDropdown
 *   value={line.width}
 *   onChange={(width) => updateLine({ width })}
 * />
 * ```
 */
export function WidthDropdown(props: WidthDropdownProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Build options from STANDARD_WIDTHS constant
  const standardOptions: DropdownOption<number>[] = STANDARD_WIDTHS.map((width) => ({
    label: `${width}"`,
    value: width,
  }));

  // Add "Custom..." option at the end
  const options: DropdownOption<number | 'custom'>[] = [
    ...standardOptions,
    {
      label: 'Custom...',
      value: 'custom',
    },
  ];

  /**
   * Handle dropdown change
   */
  const handleChange = (newValue: number | 'custom') => {
    if (newValue === 'custom') {
      setShowCustomInput(true);
      setCustomValue(value.toString());
    } else {
      onChange(newValue);
    }
  };

  /**
   * Handle custom value submission
   */
  const handleCustomSubmit = () => {
    const numValue = Number(customValue);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
      setShowCustomInput(false);
    }
  };

  /**
   * Handle custom input cancel
   */
  const handleCustomCancel = () => {
    setShowCustomInput(false);
    setCustomValue('');
  };

  /**
   * Handle custom input key press
   */
  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      handleCustomCancel();
    }
  };

  // If showing custom input, render input dialog
  if (showCustomInput) {
    return (
      <div className={className}>
        <label className="block text-xs font-medium text-neutral-600 mb-2">
          Width
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyPress}
            placeholder="Enter width..."
            min={1}
            step={0.5}
            autoFocus
            className="flex-1 h-8 px-3 text-sm text-neutral-900 bg-white border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Custom width in inches"
          />
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="h-8 px-3 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
          <button
            type="button"
            onClick={handleCustomCancel}
            className="h-8 px-3 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-neutral-600 mt-1">
          Enter a custom width in inches
        </p>
      </div>
    );
  }

  return (
    <Dropdown<number | 'custom'>
      value={value}
      options={options}
      onChange={handleChange}
      label="Width"
      disabled={disabled}
      className={className}
      ariaLabel="Duct width selector"
    />
  );
}

