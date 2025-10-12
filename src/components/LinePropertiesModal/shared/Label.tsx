/**
 * Label Component
 * 
 * Consistent label component for form inputs.
 * Provides uniform styling across all inputs in the modal.
 */

import React from 'react';

/**
 * Props for Label component
 */
export interface LabelProps {
  /** Label text */
  text: string;
  /** Whether field is required (shows asterisk) */
  required?: boolean;
  /** ID of the input this label is for */
  htmlFor?: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Label Component
 * 
 * A simple label component with consistent styling.
 * 
 * Features:
 * - 12px font size, medium weight
 * - Gray text color (#6b7280)
 * - 8px top margin
 * - Optional required indicator (red asterisk)
 * - Proper htmlFor association
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <Label
 *   text="Width"
 *   htmlFor="width-input"
 *   required
 * />
 * ```
 */
export function Label(props: LabelProps): JSX.Element {
  const { text, required = false, htmlFor, className = '' } = props;

  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-medium text-neutral-600 mb-2 ${className}`}
    >
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

