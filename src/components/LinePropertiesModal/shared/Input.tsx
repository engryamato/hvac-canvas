/**
 * Input Component
 * 
 * Reusable text/number input component with label, helper text, and validation states.
 * Used throughout the Line Properties Modal for user input.
 */

import React from 'react';

/**
 * Input type
 */
export type InputType = 'text' | 'number';

/**
 * Validation state
 */
export type ValidationState = 'default' | 'error' | 'warning' | 'success';

/**
 * Props for Input component
 */
export interface InputProps {
  /** Input type (text or number) */
  type?: InputType;
  /** Current value */
  value: string | number;
  /** Change handler */
  onChange: (value: string | number) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional label text above input */
  label?: string;
  /** Optional helper text below input */
  helperText?: string;
  /** Validation state */
  validationState?: ValidationState;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether input is required */
  required?: boolean;
  /** Minimum value (for number inputs) */
  min?: number;
  /** Maximum value (for number inputs) */
  max?: number;
  /** Step value (for number inputs) */
  step?: number;
  /** Maximum character length (for text inputs) */
  maxLength?: number;
  /** Whether to show character counter */
  showCharacterCount?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Optional id for label association */
  id?: string;
}

/**
 * Input Component
 * 
 * A versatile input component with support for text and number types.
 * 
 * Features:
 * - 32px height with 4px border radius
 * - Focus states (blue border and ring)
 * - Validation states (error, warning, success)
 * - Optional label and helper text
 * - Character counter for text inputs
 * - Min/max/step for number inputs
 * - Disabled state
 * - Keyboard accessible
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Text input with label
 * <Input
 *   type="text"
 *   value={notes}
 *   onChange={setNotes}
 *   label="Notes"
 *   placeholder="Add notes..."
 *   maxLength={120}
 *   showCharacterCount
 * />
 * 
 * // Number input with validation
 * <Input
 *   type="number"
 *   value={airflow}
 *   onChange={setAirflow}
 *   label="Airflow (CFM)"
 *   min={0}
 *   validationState={airflow < 0 ? 'error' : 'default'}
 *   helperText={airflow < 0 ? 'Airflow cannot be negative' : ''}
 * />
 * ```
 */
export function Input(props: InputProps): JSX.Element {
  const {
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    helperText,
    validationState = 'default',
    disabled = false,
    required = false,
    min,
    max,
    step,
    maxLength,
    showCharacterCount = false,
    className = '',
    ariaLabel,
    id,
  } = props;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${inputId}-helper`;

  /**
   * Get focus ring color based on validation state
   */
  const getFocusRingColor = (): string => {
    switch (validationState) {
      case 'error':
        return 'focus:ring-red-500';
      case 'warning':
        return 'focus:ring-amber-500';
      case 'success':
        return 'focus:ring-green-500';
      default:
        return 'focus:ring-blue-500';
    }
  };

  /**
   * Get helper text color based on validation state
   */
  const getHelperTextColor = (): string => {
    switch (validationState) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-neutral-600';
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  // Calculate character count for text inputs
  const characterCount = type === 'text' && typeof value === 'string' ? value.length : 0;
  const showCounter = showCharacterCount && type === 'text' && maxLength;

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-neutral-600 mb-2.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        aria-label={ariaLabel || label}
        aria-describedby={helperText ? helperTextId : undefined}
        aria-invalid={validationState === 'error'}
        aria-required={required}
        className={[
          'w-full h-8 px-3',
          'text-sm text-neutral-900 placeholder:text-neutral-500',
          'neumorphic-inset-sm rounded-xl',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          getFocusRingColor(),
          disabled && 'opacity-50 cursor-not-allowed',
        ].join(' ')}
      />

      {/* Helper Text and Character Counter */}
      {(helperText || showCounter) && (
        <div className="mt-1 flex items-center justify-between">
          {/* Helper Text */}
          {helperText && (
            <p
              id={helperTextId}
              className={`text-[11px] ${getHelperTextColor()}`}
            >
              {helperText}
            </p>
          )}

          {/* Character Counter */}
          {showCounter && (
            <p className="text-xs text-neutral-500 ml-auto">
              {characterCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

