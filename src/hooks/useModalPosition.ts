/**
 * useModalPosition Hook
 * 
 * Custom hook for calculating and managing modal position.
 * Uses smart positioning logic to keep modal visible near selected line.
 */

import { useMemo } from 'react';
import type { Line } from '../types/drawing.types';
import { calculateModalPosition } from '../utils/modal/positioning';
import { MODAL_WIDTH, MODAL_WIDTH_MIN } from '../constants/modal.constants';

/**
 * Viewport bounds
 */
export interface ViewportBounds {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
}

/**
 * Modal position result
 */
export interface ModalPosition {
  x: number;
  y: number;
  placement: 'below' | 'above' | 'left' | 'right';
}

/**
 * useModalPosition hook return value
 */
export interface UseModalPositionReturn extends ModalPosition {
  /** Responsive width based on viewport bounds */
  width: number;
}

/**
 * Props for useModalPosition hook
 */
export interface UseModalPositionProps {
  /** ID of selected line (first line if multi-select) */
  selectedLineId: string | null;
  /** All lines in the drawing */
  lines: Line[];
  /** Current modal height (changes based on tab/expanded state) */
  modalHeight: number;
  /** Current viewport bounds */
  viewportBounds: ViewportBounds;
  /** Canvas bounds for positioning calculations */
  canvasBounds?: DOMRect;
}

/**
 * useModalPosition Hook
 * 
 * Calculates optimal modal position near selected line.
 * 
 * Features:
 * - Calculates position using calculateModalPosition utility
 * - Recalculates on: line updates, viewport changes, modal height changes
 * - Returns {x, y, placement}
 * - Includes 200ms smooth transition when repositioning
 * - Preferred order: below-center, above-center, right, left
 * - Ensures 16px clearance from viewport edges
 * - Memoized for performance
 * 
 * @param props - Hook props
 * @returns Modal position with placement
 * 
 * @example
 * ```tsx
 * const { x, y, placement, width } = useModalPosition({
 *   selectedLineId: 'line-123',
 *   lines: allLines,
 *   modalHeight: 320,
 *   viewportBounds: { width: 1920, height: 1080, scrollX: 0, scrollY: 0 },
 * });
 *
 * // Apply to modal
 * <div style={{ left: x, top: y, width: `${width}px` }}>
 * ```
 */
export function useModalPosition(props: UseModalPositionProps): UseModalPositionReturn {
  const { selectedLineId, lines, modalHeight, viewportBounds, canvasBounds } = props;

  /**
   * Calculate responsive width based on viewport
   * Use MODAL_WIDTH_MIN for small viewports (< 400px), otherwise use MODAL_WIDTH
   */
  const responsiveWidth = useMemo(() => {
    return viewportBounds.width < 400 ? MODAL_WIDTH_MIN : MODAL_WIDTH;
  }, [viewportBounds.width]);

  /**
   * Calculate position using utility
   */
  const position = useMemo(() => {
    if (!selectedLineId) {
      return { x: 0, y: 0, placement: 'below' as const };
    }

    // Use canvas bounds or viewport bounds
    const bounds = canvasBounds || {
      left: 0,
      top: 0,
      right: viewportBounds.width,
      bottom: viewportBounds.height,
      width: viewportBounds.width,
      height: viewportBounds.height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };

    return calculateModalPosition(
      selectedLineId,
      lines,
      viewportBounds,
      modalHeight,
      responsiveWidth,
      bounds
    );
  }, [selectedLineId, lines, modalHeight, responsiveWidth, viewportBounds, canvasBounds]);

  return {
    ...position,
    width: responsiveWidth,
  };
}

