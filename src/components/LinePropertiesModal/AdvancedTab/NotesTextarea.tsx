/**
 * NotesTextarea Component
 * 
 * Textarea for entering notes with character counter.
 * Enforces maximum character limit from NOTE_MAX_LENGTH constant.
 */

import React from 'react';
import { NOTE_MAX_LENGTH } from '../../../constants/modal.constants';

/**
 * Props for NotesTextarea component
 */
export interface NotesTextareaProps {
  /** Current notes value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Whether textarea is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * NotesTextarea Component
 * 
 * A textarea for entering notes with character limit enforcement.
 * 
 * Features:
 * - 64px minimum height
 * - Resizable (vertical only)
 * - Character counter (e.g., "45/120") right-aligned below
 * - Maximum 120 characters (from NOTE_MAX_LENGTH constant)
 * - 10px font size
 * - Validation state when approaching/exceeding limit
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <NotesTextarea
 *   value={line.notes}
 *   onChange={(notes) => updateLine({ notes })}
 * />
 * ```
 */
export function NotesTextarea(props: NotesTextareaProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  const currentLength = value.length;
  const maxLength = NOTE_MAX_LENGTH;
  const isNearLimit = currentLength >= maxLength * 0.9; // 90% of limit
  const isAtLimit = currentLength >= maxLength;

  /**
   * Handle textarea change
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Enforce max length
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      <label
        htmlFor="notes-textarea"
        className="block text-xs font-medium text-neutral-600 mb-2"
      >
        Notes
      </label>

      {/* Textarea */}
      <textarea
        id="notes-textarea"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Add notes..."
        maxLength={maxLength}
        className={[
          'w-full min-h-16 px-3 py-2',
          'text-xs text-neutral-900',
          'bg-white border rounded',
          'resize-y',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isAtLimit ? 'border-red-500' : isNearLimit ? 'border-amber-500' : 'border-neutral-300',
        ].join(' ')}
        aria-label="Notes"
        aria-describedby="notes-counter"
      />

      {/* Character Counter */}
      <div
        id="notes-counter"
        className={[
          'text-xs text-right mt-1',
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-neutral-500',
        ].join(' ')}
        aria-live="polite"
      >
        {currentLength}/{maxLength}
      </div>
    </div>
  );
}

