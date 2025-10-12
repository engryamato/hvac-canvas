/**
 * ColorIndicator Component
 * 
 * Colored circle component for visualizing duct types and other color-coded items.
 * Used in dropdowns to show supply (blue) and return (red) indicators.
 */

import React from 'react';

/**
 * Props for ColorIndicator component
 */
export interface ColorIndicatorProps {
  /** Color value (hex, rgb, or named color) */
  color: string;
  /** Size in pixels (default: 12) */
  size?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * ColorIndicator Component
 * 
 * Displays a colored circle for visual indication.
 * 
 * Features:
 * - Circular shape (border-radius: 50%)
 * - Default size: 12px diameter
 * - Customizable size and color
 * - Accessible with aria-label
 * - Used for duct type visualization:
 *   - Supply: blue (#2563eb)
 *   - Return: red (#dc2626)
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Supply indicator (blue)
 * <ColorIndicator color="#2563eb" ariaLabel="Supply duct" />
 * 
 * // Return indicator (red)
 * <ColorIndicator color="#dc2626" ariaLabel="Return duct" />
 * 
 * // Custom size
 * <ColorIndicator color="#10b981" size={16} />
 * ```
 */
export function ColorIndicator(props: ColorIndicatorProps): JSX.Element {
  const { color, size = 12, className = '', ariaLabel } = props;

  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
      aria-label={ariaLabel}
      role="img"
    />
  );
}

