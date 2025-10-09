/**
 * DrawButton Component
 * 
 * Floating Action Button (FAB) for toggling draw mode.
 * Positioned in the bottom-right corner, adjusted for sidebar width.
 */

import React from 'react';
import { Pencil } from 'lucide-react';

/**
 * Props for DrawButton component
 */
export interface DrawButtonProps {
  /** Whether draw mode is currently active */
  isActive: boolean;
  /** Callback when button is clicked */
  onToggle: () => void;
  /** Width of the sidebar (for positioning) */
  sidebarWidth: number;
}

/**
 * DrawButton Component
 * 
 * Floating action button that toggles draw mode on/off.
 * 
 * Features:
 * - Visual state indication (active/inactive)
 * - Positioned relative to sidebar
 * - Keyboard accessible (D key)
 * - Smooth transitions
 * 
 * @param props - Component props
 * 
 * @example
 * <DrawButton
 *   isActive={isDrawActive}
 *   onToggle={() => setIsDrawActive(v => !v)}
 *   sidebarWidth={320}
 * />
 */
export function DrawButton(props: DrawButtonProps): JSX.Element {
  const { isActive, onToggle, sidebarWidth } = props;

  return (
    <button
      type="button"
      aria-label={isActive ? "Disable Draw tool" : "Enable Draw tool"}
      aria-pressed={isActive}
      title="Toggle Draw (D)"
      onClick={onToggle}
      className={[
        "group select-none fixed bottom-6 h-14 w-14 rounded-full shadow-lg focus:outline-none",
        "ring-2",
        isActive
          ? "bg-[var(--tech-blue-600)] ring-[var(--tech-blue-300)] hover:bg-[var(--tech-blue-700)]"
          : "bg-white ring-neutral-200 hover:ring-neutral-300",
        "flex items-center justify-center transition-colors"
      ].join(" ")}
      style={{
        right: `${sidebarWidth + 24}px`
      }}
    >
      <Pencil
        className={[
          "transition-transform",
          isActive ? "scale-110 text-white" : "text-neutral-700 group-hover:text-neutral-900"
        ].join(" ")}
      />
    </button>
  );
}

