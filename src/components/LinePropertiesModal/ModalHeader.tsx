/**
 * ModalHeader Component
 * 
 * Standard header for the Line Properties Modal.
 * Shows title and close button.
 */

import React from 'react';
import { X } from 'lucide-react';

/**
 * Props for ModalHeader component
 */
export interface ModalHeaderProps {
  /** Modal title */
  title?: string;
  /** Close handler */
  onClose: () => void;
  /** ID for title element (for aria-labelledby) */
  titleId?: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ModalHeader Component
 * 
 * Displays the modal header with title and close button.
 * 
 * Features:
 * - 32px height
 * - 16px horizontal padding
 * - Flex layout (space-between)
 * - Title: 14px semibold #111827
 * - Close button: X icon (16px, gray)
 * - Close button hover: darker gray
 * - Default title: "Line Properties"
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ModalHeader
 *   title="Line Properties"
 *   onClose={() => closeModal()}
 * />
 * ```
 */
export function ModalHeader(props: ModalHeaderProps): JSX.Element {
  const { title = 'Line Properties', onClose, titleId = 'modal-title', className = '' } = props;

  return (
    <header
      className={`flex items-center justify-between h-8 px-4 ${className}`}
    >
      {/* Title */}
      <h2 id={titleId} className="text-sm font-semibold text-neutral-900">
        {title}
      </h2>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </header>
  );
}

