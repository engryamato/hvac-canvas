/**
 * useDrawingState Hook tests
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDrawingState } from '../useDrawingState';
import type { Pt, SnapTarget } from '../../types';

describe('useDrawingState', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useDrawingState());
    
    expect(result.current.phase).toBe('idle');
    expect(result.current.startPoint).toBeNull();
    expect(result.current.endPoint).toBeNull();
    expect(result.current.snapTarget).toBeNull();
  });

  it('should start drawing with a point', () => {
    const { result } = renderHook(() => useDrawingState());
    const startPoint: Pt = { x: 100, y: 100 };
    const snapTarget: SnapTarget = {
      lineId: 'line-1',
      point: startPoint,
      type: 'endpoint',
      distance: 5
    };
    
    act(() => {
      result.current.startDrawing(startPoint, snapTarget);
    });
    
    expect(result.current.phase).toBe('waiting-for-end');
    expect(result.current.startPoint).toEqual(startPoint);
    expect(result.current.endPoint).toBeNull();
    expect(result.current.snapTarget).toEqual(snapTarget);
  });

  it('should update end point while drawing', () => {
    const { result } = renderHook(() => useDrawingState());
    const startPoint: Pt = { x: 100, y: 100 };
    const endPoint: Pt = { x: 200, y: 200 };
    const snapTarget: SnapTarget = {
      lineId: 'line-2',
      point: endPoint,
      type: 'midpoint',
      distance: 3
    };
    
    act(() => {
      result.current.startDrawing(startPoint, null);
    });
    
    act(() => {
      result.current.updateEndPoint(endPoint, snapTarget);
    });
    
    expect(result.current.endPoint).toEqual(endPoint);
    expect(result.current.snapTarget).toEqual(snapTarget);
  });

  it('should reset to idle state', () => {
    const { result } = renderHook(() => useDrawingState());
    const startPoint: Pt = { x: 100, y: 100 };
    const endPoint: Pt = { x: 200, y: 200 };
    
    act(() => {
      result.current.startDrawing(startPoint, null);
      result.current.updateEndPoint(endPoint, null);
    });
    
    expect(result.current.phase).toBe('waiting-for-end');
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.phase).toBe('idle');
    expect(result.current.startPoint).toBeNull();
    expect(result.current.endPoint).toBeNull();
    expect(result.current.snapTarget).toBeNull();
  });

  it('should set snap target independently', () => {
    const { result } = renderHook(() => useDrawingState());
    const snapTarget: SnapTarget = {
      lineId: 'line-3',
      point: { x: 150, y: 150 },
      type: 'line',
      distance: 10
    };
    
    act(() => {
      result.current.setSnapTarget(snapTarget);
    });
    
    expect(result.current.snapTarget).toEqual(snapTarget);
  });

  it('should clear snap target when set to null', () => {
    const { result } = renderHook(() => useDrawingState());
    const snapTarget: SnapTarget = {
      lineId: 'line-4',
      point: { x: 150, y: 150 },
      type: 'endpoint',
      distance: 5
    };
    
    act(() => {
      result.current.setSnapTarget(snapTarget);
    });
    
    expect(result.current.snapTarget).toEqual(snapTarget);
    
    act(() => {
      result.current.setSnapTarget(null);
    });
    
    expect(result.current.snapTarget).toBeNull();
  });

  it('should maintain stable callback references', () => {
    const { result, rerender } = renderHook(() => useDrawingState());
    
    const initialReset = result.current.reset;
    const initialStartDrawing = result.current.startDrawing;
    const initialUpdateEndPoint = result.current.updateEndPoint;
    const initialSetSnapTarget = result.current.setSnapTarget;
    
    rerender();
    
    expect(result.current.reset).toBe(initialReset);
    expect(result.current.startDrawing).toBe(initialStartDrawing);
    expect(result.current.updateEndPoint).toBe(initialUpdateEndPoint);
    expect(result.current.setSnapTarget).toBe(initialSetSnapTarget);
  });
});

