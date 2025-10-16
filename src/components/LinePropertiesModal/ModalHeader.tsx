/**
 * ModalHeader Component
 *
 * Standard header for the Line Properties Modal.
 * Shows title only (close button removed - modal closes via backdrop click).
 */

import React from 'react';
import type { DragHandleProps } from '../../hooks/useModalDrag';

/**
 * Props for ModalHeader component
 */
export interface ModalHeaderProps {
  /** Modal title */
  title?: string;
  /** ID for title element (for aria-labelledby) */
  titleId?: string;
  /** Optional CSS class name */
  className?: string;
  /** Drag handler props for making header draggable */
  dragHandleProps?: DragHandleProps;
}

/**
 * ModalHeader Component
 *
 * Displays the modal header with title.
 *
 * Features:
 * - 32px height
 * - 16px horizontal padding
 * - Title: 14px semibold #111827
 * - Default title: "Line Properties"
 * - No close button (modal closes via backdrop click)
 * - Draggable via drag handle props (cursor changes to grab/grabbing)
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <ModalHeader
 *   title="Line Properties"
 *   dragHandleProps={dragHandleProps}
 * />
 * ```
 */
export function ModalHeader(props: ModalHeaderProps): JSX.Element {
  const {
    title = 'Line Properties',
    titleId = 'modal-title',
    className = '',
    dragHandleProps,
  } = props;

  return (
    <header
      className={`flex items-center h-8 px-4 ${className}`}
      onMouseDown={dragHandleProps?.onMouseDown}
      style={dragHandleProps?.style}
    >
      {/* Title */}
      <h2 id={titleId} className="text-sm font-semibold text-neutral-900">
        {title}
      </h2>
    </header>
  );
}

