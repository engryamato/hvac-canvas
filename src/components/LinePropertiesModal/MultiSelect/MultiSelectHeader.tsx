/**
 * MultiSelectHeader Component
 * 
 * Header for multi-select mode showing the count of selected lines.
 * Replaces the standard header when multiple lines are selected.
 */

import React from 'react';
import { X } from 'lucide-react';

/**
 * Props for MultiSelectHeader component
 */
export interface MultiSelectHeaderProps {
  /** Number of selected lines */
  selectedCount: number;
  /** Close handler */
  onClose: () => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * MultiSelectHeader Component
 * 
 * Displays the count of selected lines in multi-select mode.
 * 
 * Features:
 * - 32px height
 * - 16px horizontal padding
 * - Dynamic count display (e.g., "1 Line Selected", "3 Lines Selected")
 * - Proper pluralization
 * - Close button (X icon, 16px, gray)
 * - Flex layout (space-between)
 * - 14px semibold text
 * - Same styling as standard header
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <MultiSelectHeader
 *   selectedCount={3}
 *   onClose={() => closeModal()}
 * />
 * // Displays: "3 Lines Selected" with close button
 * ```
 */
export function MultiSelectHeader(props: MultiSelectHeaderProps): JSX.Element {
  const { selectedCount, onClose, className = '' } = props;

  // Proper pluralization
  const title = selectedCount === 1 ? '1 Line Selected' : `${selectedCount} Lines Selected`;

  return (
    <div
      className={`flex items-center justify-between h-8 px-4 ${className}`}
      role="banner"
      aria-label={title}
    >
      {/* Title */}
      <h2 className="text-sm font-semibold text-neutral-900">
        {title}
      </h2>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

