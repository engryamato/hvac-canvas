/**
 * useDrawingState Hook
 * 
 * Manages the state for the drawing interaction flow.
 * Handles the two-phase drawing process: idle → waiting-for-end → idle.
 */

import { useState, useCallback } from 'react';
import type { DrawingPhase, Pt, SnapTarget } from '../types';

/**
 * Return type for useDrawingState hook
 */
export interface UseDrawingStateReturn {
  /** Current phase of the drawing interaction */
  phase: DrawingPhase;
  /** Starting point of the line being drawn (null when idle) */
  startPoint: Pt | null;
  /** Ending point of the line being drawn (null when idle or waiting for end) */
  endPoint: Pt | null;
  /** Current snap target for visual feedback */
  snapTarget: SnapTarget | null;
  /** Reset drawing state to idle */
  reset: () => void;
  /** Start drawing with a point and optional snap */
  startDrawing: (point: Pt, snap: SnapTarget | null) => void;
  /** Update the end point while drawing */
  updateEndPoint: (point: Pt, snap: SnapTarget | null) => void;
  /** Set snap target for visual feedback */
  setSnapTarget: (snap: SnapTarget | null) => void;
}

/**
 * Custom hook for managing drawing state
 * 
 * Consolidates all drawing-related state into a single hook.
 * Manages the two-click drawing interaction:
 * 1. First click: Set start point, enter 'waiting-for-end' phase
 * 2. Mouse move: Update end point preview with snap feedback
 * 3. Second click: Complete line, return to 'idle' phase
 * 
 * @returns Drawing state and control functions
 * 
 * @example
 * const drawingState = useDrawingState();
 * 
 * // Start drawing on first click
 * drawingState.startDrawing({ x: 100, y: 100 }, snapTarget);
 * 
 * // Update preview on mouse move
 * drawingState.updateEndPoint({ x: 200, y: 200 }, snapTarget);
 * 
 * // Complete line on second click (in parent component)
 * if (drawingState.startPoint && drawingState.endPoint) {
 *   createLine(drawingState.startPoint, drawingState.endPoint);
 *   drawingState.reset();
 * }
 * 
 * // Cancel drawing on Escape
 * drawingState.reset();
 */
export function useDrawingState(): UseDrawingStateReturn {
  const [phase, setPhase] = useState<DrawingPhase>('idle');
  const [startPoint, setStartPoint] = useState<Pt | null>(null);
  const [endPoint, setEndPoint] = useState<Pt | null>(null);
  const [snapTarget, setSnapTargetState] = useState<SnapTarget | null>(null);

  /**
   * Reset drawing state to idle
   * Clears all points and snap targets
   */
  const reset = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setSnapTargetState(null);
    setPhase('idle');
  }, []);

  /**
   * Start drawing with a point and optional snap
   * Transitions from 'idle' to 'waiting-for-end' phase
   * 
   * @param point - Starting point of the line
   * @param snap - Optional snap target for the start point
   */
  const startDrawing = useCallback((point: Pt, snap: SnapTarget | null) => {
    setStartPoint(point);
    setEndPoint(null);
    setSnapTargetState(snap);
    setPhase('waiting-for-end');
  }, []);

  /**
   * Update the end point while drawing
   * Used for preview during mouse move
   * 
   * @param point - Current end point
   * @param snap - Optional snap target for the end point
   */
  const updateEndPoint = useCallback((point: Pt, snap: SnapTarget | null) => {
    setEndPoint(point);
    setSnapTargetState(snap);
  }, []);

  /**
   * Set snap target for visual feedback
   * Used to update snap indicator during mouse move
   * 
   * @param snap - Snap target to display
   */
  const setSnapTarget = useCallback((snap: SnapTarget | null) => {
    setSnapTargetState(snap);
  }, []);

  return {
    phase,
    startPoint,
    endPoint,
    snapTarget,
    reset,
    startDrawing,
    updateEndPoint,
    setSnapTarget
  };
}

