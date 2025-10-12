/**
 * ApplyToAllCheckbox Component
 * 
 * Checkbox for controlling whether updates apply to all selected lines.
 * Only shown when user changes a mixed value in multi-select mode.
 */

import React from 'react';

/**
 * Props for ApplyToAllCheckbox component
 */
export interface ApplyToAllCheckboxProps {
  /** Whether checkbox is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Optional label text (default: "Apply to all") */
  label?: string;
  /** Whether checkbox is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ApplyToAllCheckbox Component
 * 
 * A checkbox for controlling batch update behavior in multi-select mode.
 * 
 * Features:
 * - 20px checkbox size
 * - "Apply to all" label (12px gray text)
 * - 4px margin below dropdown
 * - Only appears when user changes a mixed value
 * - Checked by default when shown
 * - Native checkbox styled to match design system
 * - Accessible with proper labels
 * 
 * Behavior:
 * - Checked: Apply update to all selected lines
 * - Unchecked: Apply update only to lines with matching current value
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * {showApplyToAll && (
 *   <ApplyToAllCheckbox
 *     checked={applyToAll}
 *     onChange={(checked) => setApplyToAll(checked)}
 *   />
 * )}
 * ```
 */
export function ApplyToAllCheckbox(props: ApplyToAllCheckboxProps): JSX.Element {
  const {
    checked,
    onChange,
    label = 'Apply to all',
    disabled = false,
    className = '',
  } = props;

  /**
   * Handle checkbox change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        id="apply-to-all-checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="w-5 h-5 text-blue-600 bg-white border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={label}
      />

      {/* Label */}
      <label
        htmlFor="apply-to-all-checkbox"
        className="text-xs text-neutral-600 select-none cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}

