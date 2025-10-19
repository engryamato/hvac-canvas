/**
 * Chip Component
 * 
 * Pill-shaped button component for quick selections and tags.
 * Used for width quick-select chips and tag management.
 */

import React from 'react';
import { X } from 'lucide-react';

/**
 * Chip size variants
 */
export type ChipSize = 'medium' | 'small';

/**
 * Props for Chip component
 */
export interface ChipProps {
  /** Display label */
  label: string;
  /** Whether chip is in active state */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether chip is removable (shows X icon) */
  removable?: boolean;
  /** Remove handler (called when X is clicked) */
  onRemove?: () => void;
  /** Size variant (medium for width chips, small for tags) */
  size?: ChipSize;
  /** Optional CSS class name */
  className?: string;
  /** Whether chip is disabled */
  disabled?: boolean;
}

/**
 * Chip Component
 * 
 * A versatile chip component with two size variants and optional remove functionality.
 * 
 * Features:
 * - **Medium size**: 28px height (for width quick-select chips)
 * - **Small size**: 24px height (for tag chips)
 * - 14px border radius (pill shape)
 * - 8px horizontal padding
 * - Active state: blue background (#2563eb), white text
 * - Inactive state: white background, gray text (#6b7280), gray border
 * - Removable variant: shows X icon (12px) on right
 * - Hover states for better UX
 * - Keyboard accessible
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Width quick-select chip (medium)
 * <Chip
 *   label="8""
 *   size="medium"
 *   active={currentWidth === 8}
 *   onClick={() => setWidth(8)}
 * />
 * 
 * // Tag chip (small, removable)
 * <Chip
 *   label="Kitchen"
 *   size="small"
 *   removable
 *   onRemove={() => removeTag('Kitchen')}
 * />
 * ```
 */
export function Chip(props: ChipProps): JSX.Element {
  const {
    label,
    active = false,
    onClick,
    removable = false,
    onRemove,
    size = 'medium',
    className = '',
    disabled = false,
  } = props;

  /**
   * Get size-specific styles
   */
  const getSizeStyles = (): string => {
    switch (size) {
      case 'small':
        return 'h-6 px-2 text-xs'; // 24px height
      case 'medium':
      default:
        return 'h-7 px-2.5 text-xs'; // 28px height
    }
  };

  /**
   * Handle chip click
   */
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  /**
   * Handle remove click
   */
  const handleRemove = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent chip onClick from firing
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || (!onClick && !removable)}
      className={[
        // Base styles
        'inline-flex items-center gap-1.5',
        'rounded-full',
        'font-medium',
        'transition-all duration-150',

        // Size styles
        getSizeStyles(),

        // Active/inactive styles
        active
          ? 'bg-blue-600 text-white border-blue-600 border'
          : 'neumorphic-raised-sm text-neutral-800',

        // Hover styles
        !disabled && onClick && !active && 'neumorphic-hover',
        !disabled && onClick && active && 'hover:bg-blue-700',

        // Active/pressed state
        !disabled && onClick && 'neumorphic-active',

        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

        // Disabled styles
        disabled && 'opacity-50 cursor-not-allowed',

        // Cursor
        onClick || removable ? 'cursor-pointer' : 'cursor-default',

        // Custom className
        className,
      ].join(' ')}
      aria-pressed={active}
      aria-disabled={disabled}
    >
      {/* Label */}
      <span className="select-none">{label}</span>

      {/* Remove button */}
      {removable && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={`Remove ${label}`}
          aria-disabled={disabled || undefined}
          onClick={handleRemove}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleRemove(event);
            }
          }}
          className={[
            'flex-shrink-0 w-3 h-3 flex items-center justify-center',
            'rounded-full',
            'transition-colors duration-150',
            active
              ? 'hover:bg-blue-500'
              : 'hover:bg-neutral-200',
            disabled && 'opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          <X className="w-2.5 h-2.5" />
        </span>
      )}
    </button>
  );
}
