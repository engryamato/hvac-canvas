/**
 * Modal Positioning Utilities
 * 
 * This module provides pure functions for calculating optimal modal position
 * on the canvas with smart boundary detection and collision avoidance.
 * 
 * The modal prefers to position below-center of the selected line, but will
 * adjust to above, left, or right if there's insufficient space.
 */

import type { Line } from '../../types/drawing.types';
import type { ModalPosition } from '../../types/modal.types';
import type { Pt } from '../../types/canvas.types';
import { MODAL_WIDTH, EDGE_CLEARANCE } from '../../constants/modal.constants';

/**
 * Canvas bounds for boundary checking
 */
export interface CanvasBounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Viewport information for positioning calculations
 */
export interface ViewportInfo {
  scale: number;
  offset: Pt;
}

/**
 * Calculate the center point of a line
 * 
 * @param line - Line to calculate center for
 * @returns Center point {x, y}
 */
function getLineCenter(line: Line): Pt {
  return {
    x: (line.a.x + line.b.x) / 2,
    y: (line.a.y + line.b.y) / 2,
  };
}

/**
 * Get the bounding box of a line
 * 
 * @param line - Line to get bounds for
 * @returns Bounding box {top, bottom, left, right}
 */
function getLineBounds(line: Line): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  return {
    top: Math.min(line.a.y, line.b.y),
    bottom: Math.max(line.a.y, line.b.y),
    left: Math.min(line.a.x, line.b.x),
    right: Math.max(line.a.x, line.b.x),
  };
}

/**
 * Check if a modal position would collide with canvas boundaries
 * 
 * @param position - Proposed modal position {x, y}
 * @param modalWidth - Width of the modal in pixels
 * @param modalHeight - Height of the modal in pixels
 * @param canvasBounds - Canvas boundaries
 * @returns True if position would cause collision
 * 
 * @example
 * ```typescript
 * const collision = checkBoundaryCollision(
 *   { x: 100, y: 100 },
 *   220,
 *   280,
 *   { width: 1920, height: 1080, top: 0, left: 0 }
 * );
 * // Returns: false (position is valid)
 * ```
 */
export function checkBoundaryCollision(
  position: Pt,
  modalWidth: number,
  modalHeight: number,
  canvasBounds: CanvasBounds
): boolean {
  const { x, y } = position;
  const { width, height, top, left } = canvasBounds;

  // Check if modal would overflow any edge (with clearance)
  const overflowsLeft = x < left + EDGE_CLEARANCE;
  const overflowsRight = x + modalWidth > left + width - EDGE_CLEARANCE;
  const overflowsTop = y < top + EDGE_CLEARANCE;
  const overflowsBottom = y + modalHeight > top + height - EDGE_CLEARANCE;

  return overflowsLeft || overflowsRight || overflowsTop || overflowsBottom;
}

/**
 * Adjust modal position to stay within canvas boundaries
 * 
 * Ensures the modal stays within the canvas with EDGE_CLEARANCE margin.
 * Adjusts position minimally to avoid boundary collisions.
 * 
 * @param position - Proposed modal position {x, y}
 * @param modalWidth - Width of the modal in pixels
 * @param modalHeight - Height of the modal in pixels
 * @param canvasBounds - Canvas boundaries
 * @returns Adjusted position that fits within boundaries
 * 
 * @example
 * ```typescript
 * const adjusted = adjustPositionForBoundaries(
 *   { x: 1800, y: 100 },  // Would overflow right edge
 *   220,
 *   280,
 *   { width: 1920, height: 1080, top: 0, left: 0 }
 * );
 * // Returns: { x: 1684, y: 100 } (adjusted to fit)
 * ```
 */
export function adjustPositionForBoundaries(
  position: Pt,
  modalWidth: number,
  modalHeight: number,
  canvasBounds: CanvasBounds
): Pt {
  let { x, y } = position;
  const { width, height, top, left } = canvasBounds;

  // Adjust horizontal position
  if (x < left + EDGE_CLEARANCE) {
    x = left + EDGE_CLEARANCE;
  } else if (x + modalWidth > left + width - EDGE_CLEARANCE) {
    x = left + width - modalWidth - EDGE_CLEARANCE;
  }

  // Adjust vertical position
  if (y < top + EDGE_CLEARANCE) {
    y = top + EDGE_CLEARANCE;
  } else if (y + modalHeight > top + height - EDGE_CLEARANCE) {
    y = top + height - modalHeight - EDGE_CLEARANCE;
  }

  return { x, y };
}

/**
 * Calculate optimal modal position near a selected line
 * 
 * Positioning priority:
 * 1. Below-center (preferred)
 * 2. Above-center
 * 3. Right-center
 * 4. Left-center
 * 
 * Always maintains EDGE_CLEARANCE (16px) from:
 * - Canvas edges
 * - Selected line
 * 
 * @param lineId - ID of the selected line
 * @param lines - Array of all lines
 * @param viewport - Viewport transformation info
 * @param modalHeight - Current height of the modal in pixels
 * @param canvasBounds - Canvas boundaries
 * @returns Modal position with placement strategy
 * 
 * @example
 * ```typescript
 * const position = calculateModalPosition(
 *   'line-123',
 *   allLines,
 *   { scale: 1, offset: { x: 0, y: 0 } },
 *   280,
 *   { width: 1920, height: 1080, top: 0, left: 0 }
 * );
 * // Returns: { x: 150, y: 250, placement: 'below' }
 * ```
 */
export function calculateModalPosition(
  lineId: string,
  lines: Line[],
  viewport: ViewportInfo,
  modalHeight: number,
  canvasBounds: CanvasBounds
): ModalPosition {
  // Find the selected line
  const line = lines.find((l) => l.id === lineId);
  if (!line) {
    // Fallback to center of canvas if line not found
    return {
      x: canvasBounds.left + canvasBounds.width / 2 - MODAL_WIDTH / 2,
      y: canvasBounds.top + canvasBounds.height / 2 - modalHeight / 2,
      placement: 'below',
    };
  }

  const center = getLineCenter(line);
  const bounds = getLineBounds(line);
  const modalWidth = MODAL_WIDTH;

  // Try positioning below-center (preferred)
  let position: Pt = {
    x: center.x - modalWidth / 2,
    y: bounds.bottom + EDGE_CLEARANCE,
  };

  if (!checkBoundaryCollision(position, modalWidth, modalHeight, canvasBounds)) {
    return {
      ...adjustPositionForBoundaries(position, modalWidth, modalHeight, canvasBounds),
      placement: 'below',
    };
  }

  // Try positioning above-center
  position = {
    x: center.x - modalWidth / 2,
    y: bounds.top - modalHeight - EDGE_CLEARANCE,
  };

  if (!checkBoundaryCollision(position, modalWidth, modalHeight, canvasBounds)) {
    return {
      ...adjustPositionForBoundaries(position, modalWidth, modalHeight, canvasBounds),
      placement: 'above',
    };
  }

  // Try positioning right-center
  position = {
    x: bounds.right + EDGE_CLEARANCE,
    y: center.y - modalHeight / 2,
  };

  if (!checkBoundaryCollision(position, modalWidth, modalHeight, canvasBounds)) {
    return {
      ...adjustPositionForBoundaries(position, modalWidth, modalHeight, canvasBounds),
      placement: 'right',
    };
  }

  // Try positioning left-center
  position = {
    x: bounds.left - modalWidth - EDGE_CLEARANCE,
    y: center.y - modalHeight / 2,
  };

  if (!checkBoundaryCollision(position, modalWidth, modalHeight, canvasBounds)) {
    return {
      ...adjustPositionForBoundaries(position, modalWidth, modalHeight, canvasBounds),
      placement: 'left',
    };
  }

  // Fallback: Force below-center with boundary adjustment
  position = {
    x: center.x - modalWidth / 2,
    y: bounds.bottom + EDGE_CLEARANCE,
  };

  return {
    ...adjustPositionForBoundaries(position, modalWidth, modalHeight, canvasBounds),
    placement: 'below',
  };
}

