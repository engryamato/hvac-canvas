/**
 * HelperText Component
 * 
 * Helper text component for providing additional context or validation messages.
 * Used below inputs to show hints, errors, warnings, or success messages.
 */

import React from 'react';

/**
 * Helper text variant types
 */
export type HelperTextVariant = 'default' | 'error' | 'warning' | 'success';

/**
 * Props for HelperText component
 */
export interface HelperTextProps {
  /** Helper text content */
  text: string;
  /** Visual variant */
  variant?: HelperTextVariant;
  /** Optional CSS class name */
  className?: string;
  /** Optional id for aria-describedby */
  id?: string;
}

/**
 * HelperText Component
 * 
 * Displays helper text with different visual variants for various contexts.
 * 
 * Features:
 * - 11px font size
 * - 4px top margin
 * - Color-coded variants:
 *   - default: gray (#6b7280)
 *   - error: red (#dc2626)
 *   - warning: amber (#f59e0b)
 *   - success: green (#10b981)
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Default helper text
 * <HelperText text="Enter a value between 1 and 100" />
 * 
 * // Error message
 * <HelperText
 *   text="Width must be positive"
 *   variant="error"
 * />
 * 
 * // Warning message
 * <HelperText
 *   text="This is not a standard width"
 *   variant="warning"
 * />
 * ```
 */
export function HelperText(props: HelperTextProps): JSX.Element {
  const { text, variant = 'default', className = '', id } = props;

  /**
   * Get color based on variant
   */
  const getColor = (): string => {
    switch (variant) {
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

  return (
    <p
      id={id}
      className={`text-xs mt-1 ${getColor()} ${className}`}
    >
      {text}
    </p>
  );
}

