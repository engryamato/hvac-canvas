/**
 * useCanvasSetup Hook
 * 
 * Handles canvas initialization and resize observation.
 * Sets up HiDPI canvas and responds to container size changes.
 */

import { useEffect, RefObject } from 'react';
import type { ViewportTransform } from '../types';
import { setupHiDPICanvas } from '../utils';

/**
 * Parameters for useCanvasSetup hook
 */
export interface UseCanvasSetupParams {
  /** Reference to the canvas element */
  canvasRef: RefObject<HTMLCanvasElement>;
  /** Reference to the container element */
  containerRef: RefObject<HTMLDivElement>;
  /** Current viewport transform */
  transform: ViewportTransform;
  /** Callback to trigger re-render after resize */
  onResize?: () => void;
}

/**
 * Custom hook for canvas setup and resize handling
 * 
 * Handles:
 * - Initial canvas setup with HiDPI support
 * - Automatic resize when container dimensions change
 * - Cleanup of resize observer on unmount
 * 
 * The canvas is automatically configured for high-DPI displays
 * and will resize to match its container while maintaining
 * the viewport transform.
 * 
 * @param params - Canvas setup parameters
 * 
 * @example
 * const canvasRef = useRef<HTMLCanvasElement>(null);
 * const containerRef = useRef<HTMLDivElement>(null);
 * const viewport = useViewportTransform();
 * 
 * useCanvasSetup({
 *   canvasRef,
 *   containerRef,
 *   transform: viewport.transform,
 *   onResize: render
 * });
 */
export function useCanvasSetup(params: UseCanvasSetupParams): void {
  const { canvasRef, containerRef, transform, onResize } = params;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    // Initial setup
    setupHiDPICanvas(canvas, transform);

    // Create resize observer
    const resizeObserver = new ResizeObserver(() => {
      setupHiDPICanvas(canvas, transform);
      onResize?.();
    });

    // Observe container for size changes
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, containerRef, transform, onResize]);
}

