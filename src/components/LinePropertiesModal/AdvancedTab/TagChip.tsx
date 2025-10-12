/**
 * TagChip Component
 * 
 * Removable chip for displaying tags.
 * Simple wrapper around the shared Chip component with small size.
 */

import React from 'react';
import { Chip } from '../shared';

/**
 * Props for TagChip component
 */
export interface TagChipProps {
  /** Tag label */
  label: string;
  /** Remove handler */
  onRemove: () => void;
  /** Whether chip is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * TagChip Component
 * 
 * A small removable chip for displaying tags.
 * 
 * Features:
 * - 24px height (small size)
 * - Removable with X button
 * - 6px padding (handled by Chip component)
 * - Uses shared Chip component
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <TagChip
 *   label="Kitchen"
 *   onRemove={() => removeTag('Kitchen')}
 * />
 * ```
 */
export function TagChip(props: TagChipProps): JSX.Element {
  const { label, onRemove, disabled = false, className = '' } = props;

  return (
    <Chip
      label={label}
      size="small"
      removable
      onRemove={onRemove}
      disabled={disabled}
      className={className}
    />
  );
}

