/**
 * CustomProperty Component
 * 
 * Displays a single custom property key-value pair with remove functionality.
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Props for CustomProperty component
 */
export interface CustomPropertyProps {
  /** Property key */
  propertyKey: string;
  /** Property value */
  value: string;
  /** Remove handler */
  onRemove: () => void;
  /** Whether property is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * CustomProperty Component
 * 
 * Displays a custom property in "key: value" format with remove button.
 * 
 * Features:
 * - 11px text size
 * - 8px padding
 * - Format: "Job: 2025-1042"
 * - X button on hover to remove
 * - Flex layout
 * - Gray color (#6b7280)
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <CustomProperty
 *   propertyKey="Job"
 *   value="2025-1042"
 *   onRemove={() => removeProperty('Job')}
 * />
 * // Displays: "Job: 2025-1042" with X button on hover
 * ```
 */
export function CustomProperty(props: CustomPropertyProps): JSX.Element {
  const { propertyKey, value, onRemove, disabled = false, className = '' } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center justify-between p-2 rounded hover:bg-neutral-50 transition-colors ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="listitem"
    >
      {/* Property Display */}
      <span className="text-xs text-neutral-600">
        <span className="font-medium">{propertyKey}:</span> {value}
      </span>

      {/* Remove Button (visible on hover) */}
      {isHovered && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors"
          aria-label={`Remove ${propertyKey} property`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

