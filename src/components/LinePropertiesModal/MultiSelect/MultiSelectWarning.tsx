/**
 * MultiSelectWarning Component
 * 
 * Warning banner displayed at the top of the modal in multi-select mode.
 * Reminds users they are editing multiple lines simultaneously.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Props for MultiSelectWarning component
 */
export interface MultiSelectWarningProps {
  /** Optional CSS class name */
  className?: string;
}

/**
 * MultiSelectWarning Component
 * 
 * Displays a warning banner in multi-select mode.
 * 
 * Features:
 * - Amber background (#fef3c7)
 * - Amber border (#fbbf24)
 * - 32px height
 * - 8px padding
 * - AlertTriangle icon
 * - "Multiple Edit" text
 * - Always shown in multi-select mode
 * - Accessible with role="alert"
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * {isMultiSelect && (
 *   <MultiSelectWarning />
 * )}
 * ```
 */
export function MultiSelectWarning(props: MultiSelectWarningProps): JSX.Element {
  const { className = '' } = props;

  return (
    <div
      className={`flex items-center gap-2 h-8 px-2 bg-amber-50 border border-amber-400 rounded ${className}`}
      role="alert"
      aria-live="polite"
    >
      {/* Warning Icon */}
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />

      {/* Warning Text */}
      <span className="text-xs font-medium text-amber-900">
        Multiple Edit
      </span>
    </div>
  );
}

