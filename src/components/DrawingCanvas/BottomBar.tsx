/**
 * BottomBar Component
 * 
 * Bottom bar with zoom controls and pan instructions.
 * Fixed at the bottom of the screen with shadow overlay.
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Props for BottomBar component
 */
export interface BottomBarProps {
  /** Current zoom level (scale) */
  zoom: number;
  /** Whether can zoom in further */
  canZoomIn: boolean;
  /** Whether can zoom out further */
  canZoomOut: boolean;
  /** Callback when zoom in button is clicked */
  onZoomIn: () => void;
  /** Callback when zoom out button is clicked */
  onZoomOut: () => void;
  /** Callback when reset zoom button is clicked */
  onResetZoom: () => void;
}

/**
 * BottomBar Component
 * 
 * Displays zoom controls and pan instructions at the bottom of the screen.
 * 
 * Features:
 * - Zoom in/out buttons with disabled states
 * - Reset zoom button (1:1)
 * - Current zoom percentage display
 * - Pan instruction text
 * - Fixed positioning with shadow
 * 
 * @param props - Component props
 * 
 * @example
 * <BottomBar
 *   zoom={1.5}
 *   canZoomIn={true}
 *   canZoomOut={true}
 *   onZoomIn={() => viewport.zoomIn({ x: 400, y: 300 })}
 *   onZoomOut={() => viewport.zoomOut({ x: 400, y: 300 })}
 *   onResetZoom={() => viewport.reset()}
 * />
 */
export function BottomBar(props: BottomBarProps): JSX.Element {
  const { zoom, canZoomIn, canZoomOut, onZoomIn, onZoomOut, onResetZoom } = props;

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center gap-4">
      {/* Zoom Out Button */}
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="px-3 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        aria-label="Zoom out"
        title="Zoom Out (-)"
      >
        <ChevronDown className="w-4 h-4" />
        <span className="text-sm">Zoom Out</span>
      </button>

      {/* Zoom Percentage Display */}
      <span className="text-sm text-neutral-700 tabular-nums min-w-[60px] text-center">
        {zoomPercentage}%
      </span>

      {/* Zoom In Button */}
      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="px-3 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        aria-label="Zoom in"
        title="Zoom In (+)"
      >
        <ChevronUp className="w-4 h-4" />
        <span className="text-sm">Zoom In</span>
      </button>

      {/* Reset Zoom Button */}
      <button
        type="button"
        onClick={onResetZoom}
        className="px-3 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
        aria-label="Reset zoom to 100%"
        title="Reset Zoom (0)"
      >
        <span className="text-sm">Reset (1:1)</span>
      </button>

      {/* Pan Instruction */}
      <span className="text-xs text-neutral-500 ml-4">
        Right-click + drag to pan
      </span>
    </div>
  );
}

