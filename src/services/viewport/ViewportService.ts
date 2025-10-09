/**
 * Viewport Service
 * 
 * Encapsulates business logic for viewport transformations including zoom and pan.
 * Handles calculations for maintaining zoom center and pan offsets.
 */

import type { Pt, ViewportTransform } from '../../types';
import { ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM } from '../../constants';

/**
 * Calculate new zoom level
 * 
 * @param currentZoom - Current zoom scale
 * @param direction - Zoom direction: 'in' or 'out'
 * @returns New zoom level clamped to valid range
 * 
 * @example
 * const newZoom = calculateZoom(1.0, 'in');
 * // Returns: 1.1
 */
export function calculateZoom(currentZoom: number, direction: 'in' | 'out'): number {
  const newZoom = direction === 'in'
    ? currentZoom * ZOOM_FACTOR
    : currentZoom / ZOOM_FACTOR;
  
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
}

/**
 * Check if zoom in is possible
 * 
 * @param currentZoom - Current zoom scale
 * @returns True if can zoom in further
 * 
 * @example
 * const canZoomIn = canZoomIn(currentZoom);
 * <button disabled={!canZoomIn}>Zoom In</button>
 */
export function canZoomIn(currentZoom: number): boolean {
  return currentZoom < MAX_ZOOM;
}

/**
 * Check if zoom out is possible
 * 
 * @param currentZoom - Current zoom scale
 * @returns True if can zoom out further
 * 
 * @example
 * const canZoomOut = canZoomOut(currentZoom);
 * <button disabled={!canZoomOut}>Zoom Out</button>
 */
export function canZoomOut(currentZoom: number): boolean {
  return currentZoom > MIN_ZOOM;
}

/**
 * Calculate new viewport offset to maintain zoom center at mouse position
 * 
 * @param mouseScreenPos - Mouse position in screen coordinates
 * @param currentTransform - Current viewport transform
 * @param newZoom - New zoom level
 * @returns New offset to keep mouse position fixed during zoom
 * 
 * @example
 * const newOffset = calculateZoomOffset(
 *   { x: 400, y: 300 },
 *   { scale: 1.0, offset: { x: 0, y: 0 } },
 *   1.1
 * );
 */
export function calculateZoomOffset(
  mouseScreenPos: Pt,
  currentTransform: ViewportTransform,
  newZoom: number
): Pt {
  // Get mouse position in canvas space (before zoom)
  const mouseCanvasX = (mouseScreenPos.x - currentTransform.offset.x) / currentTransform.scale;
  const mouseCanvasY = (mouseScreenPos.y - currentTransform.offset.y) / currentTransform.scale;
  
  // Calculate new offset to keep mouse position fixed
  const newOffsetX = mouseScreenPos.x - mouseCanvasX * newZoom;
  const newOffsetY = mouseScreenPos.y - mouseCanvasY * newZoom;
  
  return { x: newOffsetX, y: newOffsetY };
}

/**
 * Calculate new viewport offset for panning
 * 
 * @param panStart - Pan start position in screen coordinates
 * @param panCurrent - Current pan position in screen coordinates
 * @param panOffsetStart - Viewport offset when pan started
 * @returns New viewport offset
 * 
 * @example
 * const newOffset = calculatePanOffset(
 *   { x: 100, y: 100 },
 *   { x: 150, y: 120 },
 *   { x: 0, y: 0 }
 * );
 * // Returns: { x: 50, y: 20 }
 */
export function calculatePanOffset(
  panStart: Pt,
  panCurrent: Pt,
  panOffsetStart: Pt
): Pt {
  const dx = panCurrent.x - panStart.x;
  const dy = panCurrent.y - panStart.y;
  
  return {
    x: panOffsetStart.x + dx,
    y: panOffsetStart.y + dy
  };
}

/**
 * Calculate new viewport offset for pinch-zoom gesture
 * 
 * @param pinchCenter - Center point of pinch gesture in screen coordinates
 * @param touchStartOffset - Viewport offset when touch started
 * @param touchStartScale - Viewport scale when touch started
 * @param newScale - New scale from pinch gesture
 * @returns New viewport offset to keep pinch center fixed
 * 
 * @example
 * const newOffset = calculatePinchZoomOffset(
 *   { x: 400, y: 300 },
 *   { x: 0, y: 0 },
 *   1.0,
 *   1.5
 * );
 */
export function calculatePinchZoomOffset(
  pinchCenter: Pt,
  touchStartOffset: Pt,
  touchStartScale: number,
  newScale: number
): Pt {
  // Get pinch center in canvas space
  const centerCanvasX = (pinchCenter.x - touchStartOffset.x) / touchStartScale;
  const centerCanvasY = (pinchCenter.y - touchStartOffset.y) / touchStartScale;
  
  // Calculate new offset to keep pinch center fixed
  const newOffsetX = pinchCenter.x - centerCanvasX * newScale;
  const newOffsetY = pinchCenter.y - centerCanvasY * newScale;
  
  return { x: newOffsetX, y: newOffsetY };
}

/**
 * Reset viewport to default state
 * 
 * @returns Default viewport transform (1:1 scale, no offset)
 * 
 * @example
 * const defaultTransform = resetViewport();
 * setViewportTransform(defaultTransform);
 */
export function resetViewport(): ViewportTransform {
  return {
    scale: 1.0,
    offset: { x: 0, y: 0 }
  };
}

/**
 * Transform a point from screen coordinates to canvas coordinates
 * 
 * @param screenPoint - Point in screen coordinates
 * @param transform - Current viewport transform
 * @returns Point in canvas coordinates
 * 
 * @example
 * const canvasPoint = transformScreenToCanvas(
 *   { x: 100, y: 100 },
 *   viewportTransform
 * );
 */
export function transformScreenToCanvas(
  screenPoint: Pt,
  transform: ViewportTransform
): Pt {
  return {
    x: (screenPoint.x - transform.offset.x) / transform.scale,
    y: (screenPoint.y - transform.offset.y) / transform.scale
  };
}

/**
 * Transform a point from canvas coordinates to screen coordinates
 * 
 * @param canvasPoint - Point in canvas coordinates
 * @param transform - Current viewport transform
 * @returns Point in screen coordinates
 * 
 * @example
 * const screenPoint = transformCanvasToScreen(
 *   { x: 50, y: 50 },
 *   viewportTransform
 * );
 */
export function transformCanvasToScreen(
  canvasPoint: Pt,
  transform: ViewportTransform
): Pt {
  return {
    x: canvasPoint.x * transform.scale + transform.offset.x,
    y: canvasPoint.y * transform.scale + transform.offset.y
  };
}

