/**
 * Canvas rendering utilities
 * 
 * This file contains functions for setting up and managing canvas rendering,
 * including HiDPI support and viewport transformations.
 */

import type { ViewportTransform } from '../../types';

/**
 * Apply viewport transform to canvas context
 * 
 * Must be called before any drawing operations to ensure proper
 * zoom and pan behavior. This sets the canvas transformation matrix
 * to account for both the viewport transform and device pixel ratio.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param transform - Current viewport transformation
 * @param dpr - Device pixel ratio (for HiDPI displays)
 * 
 * @example
 * const ctx = canvas.getContext('2d')!;
 * const dpr = window.devicePixelRatio || 1;
 * applyViewportTransform(ctx, viewportTransform, dpr);
 * // Now draw with canvas coordinates
 * ctx.strokeRect(0, 0, 100, 100);
 */
export function applyViewportTransform(
  ctx: CanvasRenderingContext2D,
  transform: ViewportTransform,
  dpr: number
): void {
  ctx.setTransform(
    transform.scale * dpr,
    0,
    0,
    transform.scale * dpr,
    transform.offset.x * dpr,
    transform.offset.y * dpr
  );
}

/**
 * Setup canvas for HiDPI (Retina) displays
 * 
 * Configures the canvas to render at the device's native resolution
 * while maintaining the correct CSS size. This prevents blurry rendering
 * on high-DPI displays.
 * 
 * @param canvas - The canvas element to configure
 * @param transform - Current viewport transformation
 * 
 * @example
 * useEffect(() => {
 *   if (canvasRef.current) {
 *     setupHiDPICanvas(canvasRef.current, viewportTransform);
 *   }
 * }, [viewportTransform]);
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  transform: ViewportTransform
): void {
  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
  
  // Ensure minimum size of 1x1
  const w = Math.max(1, Math.floor(cssW));
  const h = Math.max(1, Math.floor(cssH));
  
  // Set canvas buffer size to account for device pixel ratio
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  
  // Apply viewport transform to context
  const ctx = canvas.getContext('2d');
  if (ctx) {
    applyViewportTransform(ctx, transform, dpr);
  }
}

