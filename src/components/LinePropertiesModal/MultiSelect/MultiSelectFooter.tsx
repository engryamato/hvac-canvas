/**
 * MultiSelectFooter Component
 * 
 * Footer for multi-select mode with Apply and Delete All buttons.
 * Replaces the standard footer when multiple lines are selected.
 */

import React from 'react';
import { Button } from '../shared';

/**
 * Props for MultiSelectFooter component
 */
export interface MultiSelectFooterProps {
  /** Apply handler */
  onApply: () => void;
  /** Delete all handler */
  onDeleteAll: () => void;
  /** Whether Apply button is disabled */
  applyDisabled?: boolean;
  /** Whether Delete All button is disabled */
  deleteDisabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * MultiSelectFooter Component
 * 
 * Displays action buttons for multi-select mode.
 * 
 * Features:
 * - 40px height
 * - 8px padding
 * - 4px gap between buttons
 * - "Apply" button (primary variant, blue)
 * - "Delete All" button (danger variant, red)
 * - Disabled states when no changes pending
 * - Replaces standard footer in multi-select mode
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <MultiSelectFooter
 *   onApply={() => applyChanges()}
 *   onDeleteAll={() => deleteAllLines()}
 *   applyDisabled={!hasChanges}
 * />
 * ```
 */
export function MultiSelectFooter(props: MultiSelectFooterProps): JSX.Element {
  const {
    onApply,
    onDeleteAll,
    applyDisabled = false,
    deleteDisabled = false,
    className = '',
  } = props;

  return (
    <div
      className={`flex items-center gap-1 h-10 p-2 ${className}`}
      role="toolbar"
      aria-label="Multi-select actions"
    >
      {/* Apply Button */}
      <Button
        variant="primary"
        onClick={onApply}
        disabled={applyDisabled}
        fullWidth
        aria-label="Apply changes to selected lines"
      >
        Apply
      </Button>

      {/* Delete All Button */}
      <Button
        variant="danger"
        onClick={onDeleteAll}
        disabled={deleteDisabled}
        fullWidth
        aria-label="Delete all selected lines"
      >
        Delete All
      </Button>
    </div>
  );
}

