/**
 * MultiSelectHeader Component
 *
 * Header for multi-select mode showing the count of selected lines.
 * Replaces the standard header when multiple lines are selected.
 */

import React from 'react';
import type { DragHandleProps } from '../../../hooks/useModalDrag';

/**
 * Props for MultiSelectHeader component
 */
export interface MultiSelectHeaderProps {
  /** Number of selected lines */
  selectedCount: number;
  /** Optional CSS class name */
  className?: string;
  /** Drag handler props for making header draggable */
  dragHandleProps?: DragHandleProps;
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
 * - 14px semibold text
 * - Same styling as standard header
 * - No close button (modal closes via backdrop click)
 * - Draggable via drag handle props (cursor changes to grab/grabbing)
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <MultiSelectHeader
 *   selectedCount={3}
 *   dragHandleProps={dragHandleProps}
 * />
 * // Displays: "3 Lines Selected"
 * ```
 */
export function MultiSelectHeader(props: MultiSelectHeaderProps): JSX.Element {
  const { selectedCount, className = '', dragHandleProps } = props;

  // Proper pluralization
  const title = selectedCount === 1 ? '1 Line Selected' : `${selectedCount} Lines Selected`;

  return (
    <div
      className={`flex items-center h-8 px-4 ${className}`}
      role="banner"
      aria-label={title}
      onMouseDown={dragHandleProps?.onMouseDown}
      style={dragHandleProps?.style}
    >
      {/* Title */}
      <h2 className="text-sm font-semibold text-neutral-900">
        {title}
      </h2>
    </div>
  );
}

