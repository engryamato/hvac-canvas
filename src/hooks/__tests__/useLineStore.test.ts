/**
 * useLineStore hook tests
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLineStore } from '../useLineStore';
import { initializeLineDefaults } from '../../services';
import type { Line } from '../../types';

function createLine(overrides: Partial<Line> = {}): Line {
  return initializeLineDefaults({
    id: overrides.id ?? `line-${Math.random().toString(36).slice(2, 8)}`,
    a: overrides.a ?? { x: 0, y: 0 },
    b: overrides.b ?? { x: 10, y: 0 },
    width: overrides.width ?? 8,
    color: overrides.color ?? '#2563eb',
    ...overrides,
  });
}

describe('useLineStore', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useLineStore());

    expect(result.current.lines).toHaveLength(0);
    expect(result.current.selectedLineIds).toHaveLength(0);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.hasSelection).toBe(false);
  });

  it('should add a line and optionally select it', () => {
    const { result } = renderHook(() => useLineStore());
    const line = createLine({ id: 'line-1' });

    act(() => {
      result.current.addLine(line, { select: true, openModal: true });
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.selectedLineIds).toEqual(['line-1']);
    expect(result.current.isModalOpen).toBe(true);
  });

  it('should support multi-select toggling', () => {
    const lineA = createLine({ id: 'line-a' });
    const lineB = createLine({ id: 'line-b' });
    const { result } = renderHook(() => useLineStore([lineA, lineB]));

    act(() => {
      result.current.selectLine('line-a');
    });

    act(() => {
      result.current.selectLine('line-b', { multiSelect: true });
    });

    expect(result.current.selectedLineIds).toEqual(['line-a', 'line-b']);

    act(() => {
      result.current.selectLine('line-b', { multiSelect: true });
    });

    expect(result.current.selectedLineIds).toEqual(['line-a']);
  });

  it('should remove selected lines and clear selection', () => {
    const lineA = createLine({ id: 'line-a' });
    const lineB = createLine({ id: 'line-b' });
    const { result } = renderHook(() => useLineStore([lineA, lineB]));

    act(() => {
      result.current.setSelection(['line-a', 'line-b']);
    });

    act(() => {
      result.current.removeSelectedLines();
    });

    expect(result.current.lines).toHaveLength(0);
    expect(result.current.selectedLineIds).toHaveLength(0);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('should duplicate selected lines with new IDs', () => {
    const line = createLine({ id: 'line-1' });
    const { result } = renderHook(() => useLineStore([line]));

    act(() => {
      result.current.setSelection(['line-1']);
    });

    act(() => {
      result.current.duplicateSelectedLines({ x: 10, y: 10 });
    });

    expect(result.current.lines).toHaveLength(2);
    expect(result.current.selectedLineIds).toHaveLength(1);
    expect(result.current.selectedLineIds[0]).not.toBe('line-1');
  });

  it('should update line properties with metadata timestamp', () => {
    const line = createLine({
      id: 'line-1',
      metadata: { createdAt: 1, updatedAt: 1 },
    });
    const { result } = renderHook(() => useLineStore([line]));

    act(() => {
      result.current.updateLineProperties('line-1', { width: 12 });
    });

    const updatedLine = result.current.lines[0];
    expect(updatedLine.width).toBe(12);
    expect(updatedLine.metadata.updatedAt).not.toBe(1);
  });

  it('should update line length immutably', () => {
    const line = createLine({
      id: 'line-1',
      a: { x: 0, y: 0 },
      b: { x: 10, y: 0 },
    });
    const { result } = renderHook(() => useLineStore([line]));

    act(() => {
      result.current.updateLineLength('line-1', 20);
    });

    const updatedLine = result.current.lines[0];
    const length = Math.hypot(
      updatedLine.b.x - updatedLine.a.x,
      updatedLine.b.y - updatedLine.a.y
    );
    expect(length).toBeCloseTo(20);
  });

  it('should update selected line width using updater', () => {
    const line = createLine({ id: 'line-1', width: 8 });
    const { result } = renderHook(() => useLineStore([line]));

    act(() => {
      result.current.updateSelectedLineWidth('line-1', (width) => width + 2);
    });

    expect(result.current.lines[0].width).toBe(10);
  });
});
