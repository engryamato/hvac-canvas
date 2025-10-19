/**
 * StatusIcon Component
 * 
 * Icon component for displaying status indicators (success, warning, error, info).
 * Used in calculation results and validation messages.
 */

import React from 'react';
import { Check, AlertTriangle, X, Info } from 'lucide-react';

/**
 * Status types
 */
export type StatusType = 'success' | 'warning' | 'error' | 'info';

/**
 * Props for StatusIcon component
 */
export interface StatusIconProps {
  /** Status type */
  status: StatusType;
  /** Icon size in pixels (default: 14) */
  size?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * StatusIcon Component
 * 
 * Displays color-coded status icons for different states.
 * 
 * Features:
 * - **Success**: Green checkmark (✓)
 * - **Warning**: Amber warning triangle (⚠️)
 * - **Error**: Red X (✕)
 * - **Info**: Blue info circle (ℹ️)
 * - Default size: 14px
 * - Customizable size
 * - Accessible with aria-label
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * // Success icon
 * <StatusIcon status="success" />
 * 
 * // Warning icon with custom size
 * <StatusIcon status="warning" size={16} />
 * 
 * // Error icon with aria-label
 * <StatusIcon
 *   status="error"
 *   ariaLabel="Validation error"
 * />
 * ```
 */
export function StatusIcon(props: StatusIconProps): JSX.Element {
  const { status, size = 14, className = '', ariaLabel } = props;

  /**
   * Get icon component and color based on status
   */
  const getIconConfig = (): { Icon: React.ElementType; color: string; label: string } => {
    switch (status) {
      case 'success':
        return {
          Icon: Check,
          color: 'text-green-700',
          label: 'Success',
        };
      case 'warning':
        return {
          Icon: AlertTriangle,
          color: 'text-amber-600',
          label: 'Warning',
        };
      case 'error':
        return {
          Icon: X,
          color: 'text-red-600',
          label: 'Error',
        };
      case 'info':
        return {
          Icon: Info,
          color: 'text-blue-600',
          label: 'Information',
        };
    }
  };

  const { Icon, color, label } = getIconConfig();

  return (
    <Icon
      className={`${color} ${className}`}
      size={size}
      aria-label={ariaLabel || label}
      role="img"
    />
  );
}

