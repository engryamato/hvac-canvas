/**
 * Button Component
 * 
 * Reusable button component with multiple variants for different use cases.
 * Used throughout the Line Properties Modal for actions and controls.
 */

import React from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'danger' | 'expand';

/**
 * Props for Button component
 */
export interface ButtonProps {
  /** Button variant (primary, danger, expand) */
  variant?: ButtonVariant;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Optional aria-expanded for accessibility (for expandable buttons) */
  'aria-expanded'?: boolean;
  /** Optional aria-label for accessibility (kebab-case variant) */
  'aria-label'?: string;
}

/**
 * Button Component
 * 
 * A versatile button component with three variants:
 * - **primary**: White background, gray text, gray border (default actions)
 * - **danger**: White background, red text, red border (destructive actions)
 * - **expand**: White background, gray text, dashed border (expand/collapse)
 * 
 * Features:
 * - 40px height with 6px border radius
 * - 12px horizontal padding
 * - Hover states (slight background darken)
 * - Disabled state (50% opacity, no pointer events)
 * - Optional icon support
 * - Loading state support
 * - Full width option
 * - Keyboard accessible
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleDuplicate}>
 *   Duplicate
 * </Button>
 * 
 * // Danger button
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete
 * </Button>
 * 
 * // Expand button with icon
 * <Button variant="expand" icon={<ChevronDown />}>
 *   More Details
 * </Button>
 * ```
 */
export function Button(props: ButtonProps): JSX.Element {
  const {
    variant = 'primary',
    onClick,
    disabled = false,
    children,
    icon,
    fullWidth = false,
    loading = false,
    type = 'button',
    className = '',
    ariaLabel,
    'aria-expanded': ariaExpanded,
    'aria-label': ariaLabelKebab,
  } = props;

  /**
   * Get variant-specific styles
   */
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'danger':
        return [
          'border-red-600 text-red-600',
          'hover:bg-red-50',
          'active:bg-red-100',
        ].join(' ');

      case 'expand':
        return [
          'border-neutral-300 border-dashed text-neutral-600',
          'hover:bg-neutral-50',
          'active:bg-neutral-100',
        ].join(' ');

      case 'primary':
      default:
        return [
          'border-neutral-300 text-neutral-700',
          'hover:bg-neutral-50',
          'active:bg-neutral-100',
        ].join(' ');
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabelKebab || ariaLabel}
      aria-expanded={ariaExpanded}
      aria-busy={loading ? true : undefined}
      className={[
        // Base styles
        'h-10 px-3 rounded-md',
        'text-sm font-semibold',
        'bg-white border',
        'flex items-center justify-center gap-2',
        'transition-colors duration-150',
        
        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        
        // Width
        fullWidth ? 'w-full' : 'min-w-[72px]',
        
        // Variant styles
        getVariantStyles(),
        
        // Disabled/loading styles
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        
        // Custom className
        className,
      ].join(' ')}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon */}
      {!loading && icon && (
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {icon}
        </span>
      )}

      {/* Content */}
      <span>{children}</span>
    </button>
  );
}

