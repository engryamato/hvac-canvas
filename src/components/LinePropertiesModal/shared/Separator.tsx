/**
 * Separator Component
 * 
 * Horizontal line component for visual separation between sections.
 * Used between header, tabs, content, and footer in the modal.
 */

import React from 'react';

/**
 * Props for Separator component
 */
export interface SeparatorProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Separator Component
 * 
 * A simple horizontal line for visual separation.
 * 
 * Features:
 * - 1px height
 * - Light gray color (#e5e7eb)
 * - Full width
 * - Semantic HTML (hr element)
 * - Accessible with aria-label
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ModalHeader />
 * <Separator />
 * <TabBar />
 * <Separator />
 * <TabContent />
 * ```
 */
export function Separator(props: SeparatorProps): JSX.Element {
  const { className = '', ariaLabel } = props;

  return (
    <hr
      className={`border-0 border-t border-neutral-200 ${className}`}
      aria-label={ariaLabel}
    />
  );
}

