/**
 * ModalFooter Component
 * 
 * Standard footer for the Line Properties Modal.
 * Shows Duplicate and Delete buttons.
 */

import React from 'react';
import { Button } from './shared';

/**
 * Props for ModalFooter component
 */
export interface ModalFooterProps {
  /** Duplicate handler */
  onDuplicate: () => void;
  /** Delete handler */
  onDelete: () => void;
  /** Whether Duplicate button is disabled */
  duplicateDisabled?: boolean;
  /** Whether Delete button is disabled */
  deleteDisabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ModalFooter Component
 * 
 * Displays action buttons for single-select mode.
 * 
 * Features:
 * - 40px height
 * - 8px padding
 * - 4px gap between buttons
 * - Duplicate button (primary variant)
 * - Delete button (danger variant)
 * - Disabled states
 * - Full-width buttons
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ModalFooter
 *   onDuplicate={() => duplicateLine()}
 *   onDelete={() => deleteLine()}
 * />
 * ```
 */
export function ModalFooter(props: ModalFooterProps): JSX.Element {
  const {
    onDuplicate,
    onDelete,
    duplicateDisabled = false,
    deleteDisabled = false,
    className = '',
  } = props;

  return (
    <div
      className={`flex items-center gap-1 h-10 p-2 ${className}`}
      role="toolbar"
      aria-label="Line actions"
    >
      {/* Duplicate Button */}
      <Button
        variant="primary"
        onClick={onDuplicate}
        disabled={duplicateDisabled}
        fullWidth
        aria-label="Duplicate line"
      >
        Duplicate
      </Button>

      {/* Delete Button */}
      <Button
        variant="danger"
        onClick={onDelete}
        disabled={deleteDisabled}
        fullWidth
        aria-label="Delete line"
      >
        Delete
      </Button>
    </div>
  );
}

