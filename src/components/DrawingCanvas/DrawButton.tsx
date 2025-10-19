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

  // Position FAB with proper spacing from bottom bar (60px) and sidebar
  // Bottom spacing: 60px (bottom bar) + 24px (gap) = 84px from viewport bottom
  const BOTTOM_BAR_HEIGHT = 60;
  const SPACING_FROM_BOTTOM_BAR = 24;
  const bottomPosition = BOTTOM_BAR_HEIGHT + SPACING_FROM_BOTTOM_BAR;

  return (
    <button
      type="button"
      aria-label={isActive ? "Disable Draw tool" : "Enable Draw tool"}
      aria-pressed={isActive}
      title="Toggle Draw (D)"
      onClick={onToggle}
      className={[
        "group select-none fixed h-14 w-14 rounded-full",
        "flex items-center justify-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "transition-all duration-300",
        isActive
          ? "neumorphic-inset-md"
          : "neumorphic-raised-sm neumorphic-hover"
      ].join(" ")}
      style={{
        right: `${sidebarWidth + 24}px`,
        bottom: `${bottomPosition}px`,
        transition: 'right 300ms ease-in-out',
        zIndex: 50
      }}
    >
      <Pencil
        size={20}
        className={[
          "transition-all duration-300",
          isActive
            ? "scale-110 text-primary-600"
            : "text-neutral-700 group-hover:text-neutral-900 group-hover:scale-105"
        ].join(" ")}
      />
    </button>
  );
}
