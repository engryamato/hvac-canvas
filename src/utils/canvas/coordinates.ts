/**
 * Canvas coordinate transformation utilities
 * 
 * This file contains functions for converting between screen and canvas coordinates,
 * accounting for viewport zoom and pan transformations.
 */

import type { Pt, ViewportTransform } from '../../types';

/**
 * Convert screen coordinates to canvas coordinates
 * 
 * Accounts for viewport zoom (scale) and pan (offset).
 * Screen coordinates are in pixels relative to the canvas element.
 * Canvas coordinates are in the virtual canvas space.
 * 
 * @param screenX - X coordinate in screen space (pixels)
 * @param screenY - Y coordinate in screen space (pixels)
 * @param transform - Current viewport transformation
 * @returns Point in canvas coordinate space
 * 
 * @example
 * const canvasPoint = screenToCanvas(
 *   100, 100,
 *   { scale: 2.0, offset: { x: 50, y: 50 } }
 * );
 * // Returns: { x: 25, y: 25 }
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  transform: ViewportTransform
): Pt {
  return {
    x: (screenX - transform.offset.x) / transform.scale,
    y: (screenY - transform.offset.y) / transform.scale
  };
}

/**
 * Convert canvas coordinates to screen coordinates
 * 
 * Accounts for viewport zoom (scale) and pan (offset).
 * Canvas coordinates are in the virtual canvas space.
 * Screen coordinates are in pixels relative to the canvas element.
 * 
 * @param canvasX - X coordinate in canvas space
 * @param canvasY - Y coordinate in canvas space
 * @param transform - Current viewport transformation
 * @returns Point in screen coordinate space (pixels)
 * 
 * @example
 * const screenPoint = canvasToScreen(
 *   25, 25,
 *   { scale: 2.0, offset: { x: 50, y: 50 } }
 * );
 * // Returns: { x: 100, y: 100 }
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  transform: ViewportTransform
): Pt {
  return {
    x: canvasX * transform.scale + transform.offset.x,
    y: canvasY * transform.scale + transform.offset.y
  };
}

/**
 * Get pointer position in canvas coordinates from a pointer event
 * 
 * Converts the event's client coordinates to canvas coordinates,
 * accounting for the canvas element's position and viewport transform.
 * 
 * @param canvas - The canvas element
 * @param evt - Pointer event (mouse or touch)
 * @param transform - Current viewport transformation
 * @returns Point in canvas coordinate space
 * 
 * @example
 * const handlePointerDown = (evt: React.PointerEvent) => {
 *   const pos = getPointerPos(canvasRef.current!, evt, viewportTransform);
 *   console.log('Clicked at canvas position:', pos);
 * };
 */
export function getPointerPos(
  canvas: HTMLCanvasElement,
  evt: PointerEvent | React.PointerEvent,
  transform: ViewportTransform
): Pt {
  const rect = canvas.getBoundingClientRect();
  const screenX = evt.clientX - rect.left;
  const screenY = evt.clientY - rect.top;
  return screenToCanvas(screenX, screenY, transform);
}

