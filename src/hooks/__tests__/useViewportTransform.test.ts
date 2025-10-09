/**
 * useViewportTransform Hook tests
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewportTransform } from '../useViewportTransform';
import type { Pt } from '../../types';

describe('useViewportTransform', () => {
  it('should initialize with default transform', () => {
    const { result } = renderHook(() => useViewportTransform());
    
    expect(result.current.scale).toBe(1.0);
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
    expect(result.current.transform).toEqual({
      scale: 1.0,
      offset: { x: 0, y: 0 }
    });
    expect(result.current.canZoomIn).toBe(true);
    expect(result.current.canZoomOut).toBe(true);
  });

  it('should zoom in at mouse position', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };
    
    act(() => {
      result.current.zoomIn(mousePos);
    });
    
    expect(result.current.scale).toBeGreaterThan(1.0);
    expect(result.current.scale).toBeCloseTo(1.1);
  });

  it('should zoom out at mouse position', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };
    
    // Zoom in first
    act(() => {
      result.current.zoomIn(mousePos);
    });
    
    const zoomedInScale = result.current.scale;
    
    // Then zoom out
    act(() => {
      result.current.zoomOut(mousePos);
    });
    
    expect(result.current.scale).toBeLessThan(zoomedInScale);
    expect(result.current.scale).toBeCloseTo(1.0);
  });

  it('should zoom by wheel delta', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };
    
    // Negative deltaY = zoom in
    act(() => {
      result.current.zoomByWheel(mousePos, -100);
    });
    
    expect(result.current.scale).toBeGreaterThan(1.0);
  });

  it('should not zoom beyond max zoom', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };

    // Zoom in many times
    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.zoomIn(mousePos);
      });
    }

    expect(result.current.scale).toBeLessThanOrEqual(10.0);
    expect(result.current.canZoomIn).toBe(false);
  });

  it('should not zoom beyond min zoom', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };

    // Zoom out many times
    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.zoomOut(mousePos);
      });
    }

    expect(result.current.scale).toBeGreaterThanOrEqual(0.1);
    expect(result.current.canZoomOut).toBe(false);
  });

  it('should start and update pan', () => {
    const { result } = renderHook(() => useViewportTransform());
    const panStart: Pt = { x: 100, y: 100 };
    const panCurrent: Pt = { x: 150, y: 120 };
    
    act(() => {
      result.current.startPan(panStart);
    });
    
    expect(result.current.isPanning).toBe(true);
    
    act(() => {
      result.current.updatePan(panCurrent);
    });
    
    expect(result.current.offset).toEqual({ x: 50, y: 20 });
  });

  it('should end pan', () => {
    const { result } = renderHook(() => useViewportTransform());
    const panStart: Pt = { x: 100, y: 100 };
    
    act(() => {
      result.current.startPan(panStart);
    });
    
    expect(result.current.isPanning).toBe(true);
    
    act(() => {
      result.current.endPan();
    });
    
    expect(result.current.isPanning).toBe(false);
  });

  it('should handle pinch zoom', () => {
    const { result } = renderHook(() => useViewportTransform());
    const center: Pt = { x: 400, y: 300 };
    const startDistance = 100;
    const endDistance = 200;
    
    act(() => {
      result.current.startPinchZoom(center, startDistance);
    });
    
    act(() => {
      result.current.updatePinchZoom(center, endDistance);
    });
    
    // Scale should double (200 / 100 = 2.0)
    expect(result.current.scale).toBeCloseTo(2.0);
  });

  it('should end pinch zoom', () => {
    const { result } = renderHook(() => useViewportTransform());
    const center: Pt = { x: 400, y: 300 };

    act(() => {
      result.current.startPinchZoom(center, 100);
    });

    act(() => {
      result.current.endPinchZoom();
    });

    // Should be able to start a new pinch zoom
    act(() => {
      result.current.startPinchZoom(center, 100);
    });

    act(() => {
      result.current.updatePinchZoom(center, 150);
    });

    expect(result.current.scale).toBeGreaterThan(1.0);
  });

  it('should reset viewport to default', () => {
    const { result } = renderHook(() => useViewportTransform());
    const mousePos: Pt = { x: 400, y: 300 };
    
    // Zoom and pan
    act(() => {
      result.current.zoomIn(mousePos);
      result.current.startPan({ x: 100, y: 100 });
      result.current.updatePan({ x: 200, y: 200 });
      result.current.endPan();
    });
    
    expect(result.current.scale).not.toBe(1.0);
    expect(result.current.offset).not.toEqual({ x: 0, y: 0 });
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.scale).toBe(1.0);
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });

  it('should not update pan when not panning', () => {
    const { result } = renderHook(() => useViewportTransform());
    
    act(() => {
      result.current.updatePan({ x: 100, y: 100 });
    });
    
    // Offset should remain at default
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });

  it('should clamp pinch zoom to limits', () => {
    const { result } = renderHook(() => useViewportTransform());
    const center: Pt = { x: 400, y: 300 };
    
    act(() => {
      result.current.startPinchZoom(center, 100);
      // Try to zoom to 100x (way beyond max)
      result.current.updatePinchZoom(center, 10000);
    });
    
    expect(result.current.scale).toBeLessThanOrEqual(10.0);
  });
});

