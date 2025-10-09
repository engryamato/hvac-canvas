/**
 * useViewportTransform Hook
 * 
 * Manages viewport transformation state including zoom and pan.
 * Handles mouse wheel zoom, button zoom, pan gestures, and touch pinch-zoom.
 */

import { useState, useCallback } from 'react';
import type { Pt, ViewportTransform } from '../types';
import {
  calculateZoom,
  canZoomIn,
  canZoomOut,
  calculateZoomOffset,
  calculatePanOffset,
  calculatePinchZoomOffset,
  resetViewport as resetViewportService,
} from '../services';
import { MIN_ZOOM, MAX_ZOOM } from '../constants';

/**
 * Return type for useViewportTransform hook
 */
export interface UseViewportTransformReturn {
  /** Current viewport scale (zoom level) */
  scale: number;
  /** Current viewport offset (pan position) */
  offset: Pt;
  /** Combined viewport transform */
  transform: ViewportTransform;
  /** Zoom in at a specific screen position */
  zoomIn: (mouseScreenPos: Pt) => void;
  /** Zoom out at a specific screen position */
  zoomOut: (mouseScreenPos: Pt) => void;
  /** Zoom by mouse wheel at a specific screen position */
  zoomByWheel: (mouseScreenPos: Pt, deltaY: number) => void;
  /** Start panning */
  startPan: (screenPos: Pt) => void;
  /** Update pan position */
  updatePan: (screenPos: Pt) => void;
  /** End panning */
  endPan: () => void;
  /** Check if currently panning */
  isPanning: boolean;
  /** Start pinch-zoom gesture */
  startPinchZoom: (center: Pt, distance: number) => void;
  /** Update pinch-zoom gesture */
  updatePinchZoom: (center: Pt, distance: number) => void;
  /** End pinch-zoom gesture */
  endPinchZoom: () => void;
  /** Reset viewport to default state */
  reset: () => void;
  /** Check if can zoom in further */
  canZoomIn: boolean;
  /** Check if can zoom out further */
  canZoomOut: boolean;
}

/**
 * Custom hook for managing viewport transformation
 * 
 * Handles all viewport-related state and operations:
 * - Zoom in/out with mouse wheel or buttons
 * - Pan with right-click drag
 * - Pinch-zoom on touch devices
 * - Reset to default view
 * 
 * @returns Viewport state and control functions
 * 
 * @example
 * const viewport = useViewportTransform();
 * 
 * // Zoom in at mouse position
 * viewport.zoomIn({ x: 400, y: 300 });
 * 
 * // Pan
 * viewport.startPan({ x: 100, y: 100 });
 * viewport.updatePan({ x: 150, y: 120 });
 * viewport.endPan();
 * 
 * // Reset view
 * viewport.reset();
 */
export function useViewportTransform(): UseViewportTransformReturn {
  const [scale, setScale] = useState(1.0);
  const [offset, setOffset] = useState<Pt>({ x: 0, y: 0 });
  
  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Pt | null>(null);
  const [panOffsetStart, setPanOffsetStart] = useState<Pt | null>(null);
  
  // Touch gesture state
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartScale, setTouchStartScale] = useState(1.0);
  const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);

  const transform: ViewportTransform = { scale, offset };

  /**
   * Zoom in at a specific screen position
   * 
   * @param mouseScreenPos - Mouse position in screen coordinates
   */
  const zoomIn = useCallback((mouseScreenPos: Pt) => {
    if (!canZoomIn(scale)) return;
    
    const newScale = calculateZoom(scale, 'in');
    const newOffset = calculateZoomOffset(mouseScreenPos, transform, newScale);
    
    setScale(newScale);
    setOffset(newOffset);
  }, [scale, offset]);

  /**
   * Zoom out at a specific screen position
   * 
   * @param mouseScreenPos - Mouse position in screen coordinates
   */
  const zoomOut = useCallback((mouseScreenPos: Pt) => {
    if (!canZoomOut(scale)) return;
    
    const newScale = calculateZoom(scale, 'out');
    const newOffset = calculateZoomOffset(mouseScreenPos, transform, newScale);
    
    setScale(newScale);
    setOffset(newOffset);
  }, [scale, offset]);

  /**
   * Zoom by mouse wheel at a specific screen position
   * 
   * @param mouseScreenPos - Mouse position in screen coordinates
   * @param deltaY - Mouse wheel delta (negative = zoom in, positive = zoom out)
   */
  const zoomByWheel = useCallback((mouseScreenPos: Pt, deltaY: number) => {
    const delta = -deltaY;
    if (delta === 0) return;

    const direction = delta > 0 ? 'in' : 'out';
    const newScale = calculateZoom(scale, direction);
    
    if (newScale === scale) return; // At zoom limit
    
    const newOffset = calculateZoomOffset(mouseScreenPos, transform, newScale);
    
    setScale(newScale);
    setOffset(newOffset);
  }, [scale, offset]);

  /**
   * Start panning
   * 
   * @param screenPos - Starting screen position
   */
  const startPan = useCallback((screenPos: Pt) => {
    setIsPanning(true);
    setPanStart(screenPos);
    setPanOffsetStart(offset);
  }, [offset]);

  /**
   * Update pan position
   * 
   * @param screenPos - Current screen position
   */
  const updatePan = useCallback((screenPos: Pt) => {
    if (!isPanning || !panStart || !panOffsetStart) return;
    
    const newOffset = calculatePanOffset(panStart, screenPos, panOffsetStart);
    setOffset(newOffset);
  }, [isPanning, panStart, panOffsetStart]);

  /**
   * End panning
   */
  const endPan = useCallback(() => {
    setIsPanning(false);
    setPanStart(null);
    setPanOffsetStart(null);
  }, []);

  /**
   * Start pinch-zoom gesture
   * 
   * @param center - Center point of pinch in screen coordinates
   * @param distance - Distance between touch points
   */
  const startPinchZoom = useCallback((center: Pt, distance: number) => {
    setTouchStartDistance(distance);
    setTouchStartScale(scale);
    setTouchStartOffset(offset);
  }, [scale, offset]);

  /**
   * Update pinch-zoom gesture
   * 
   * @param center - Center point of pinch in screen coordinates
   * @param distance - Current distance between touch points
   */
  const updatePinchZoom = useCallback((center: Pt, distance: number) => {
    if (touchStartDistance === null || !touchStartOffset) return;
    
    const scaleFactor = distance / touchStartDistance;
    let newScale = touchStartScale * scaleFactor;
    
    // Clamp to zoom limits
    newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
    
    const newOffset = calculatePinchZoomOffset(
      center,
      touchStartOffset,
      touchStartScale,
      newScale
    );
    
    setScale(newScale);
    setOffset(newOffset);
  }, [touchStartDistance, touchStartScale, touchStartOffset]);

  /**
   * End pinch-zoom gesture
   */
  const endPinchZoom = useCallback(() => {
    setTouchStartDistance(null);
    setTouchStartScale(1.0);
    setTouchStartOffset(null);
  }, []);

  /**
   * Reset viewport to default state (1:1 scale, no offset)
   */
  const reset = useCallback(() => {
    const defaultTransform = resetViewportService();
    setScale(defaultTransform.scale);
    setOffset(defaultTransform.offset);
  }, []);

  return {
    scale,
    offset,
    transform,
    zoomIn,
    zoomOut,
    zoomByWheel,
    startPan,
    updatePan,
    endPan,
    isPanning,
    startPinchZoom,
    updatePinchZoom,
    endPinchZoom,
    reset,
    canZoomIn: canZoomIn(scale),
    canZoomOut: canZoomOut(scale),
  };
}

