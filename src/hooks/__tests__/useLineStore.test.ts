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

  describe('Connection Detection', () => {
    it('should compute connection graph when lines are added', () => {
      const { result } = renderHook(() => useLineStore());

      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 100, y: 0 },
        b: { x: 100, y: 100 },
      });

      act(() => {
        result.current.addLine(lineA);
        result.current.addLine(lineB);
      });

      // Verify connections are computed
      expect(result.current.connections).toBeDefined();
      expect(result.current.connections['line-a']).toBeDefined();
      expect(result.current.connections['line-b']).toBeDefined();

      // Verify lineA.b connects to lineB.a
      expect(result.current.connections['line-a'].b).toContainEqual({
        lineId: 'line-b',
        endpoint: 'a',
      });
      expect(result.current.connections['line-b'].a).toContainEqual({
        lineId: 'line-a',
        endpoint: 'b',
      });
    });

    it('should update connection graph when lines are modified', () => {
      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 200, y: 200 },
        b: { x: 300, y: 200 },
      });

      const { result } = renderHook(() => useLineStore([lineA, lineB]));

      // Initially no connections
      expect(result.current.connections['line-a'].b).toHaveLength(0);
      expect(result.current.connections['line-b'].a).toHaveLength(0);

      // Move lineB.a to connect with lineA.b
      act(() => {
        result.current.updateLine('line-b', (line) => ({
          ...line,
          a: { x: 100, y: 0 },
        }));
      });

      // Now they should be connected
      expect(result.current.connections['line-a'].b).toContainEqual({
        lineId: 'line-b',
        endpoint: 'a',
      });
      expect(result.current.connections['line-b'].a).toContainEqual({
        lineId: 'line-a',
        endpoint: 'b',
      });
    });

    it('should update connection graph when lines are deleted', () => {
      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 100, y: 0 },
        b: { x: 100, y: 100 },
      });

      const { result } = renderHook(() => useLineStore([lineA, lineB]));

      // Verify initial connection
      expect(result.current.connections['line-a'].b).toHaveLength(1);

      // Remove lineB
      act(() => {
        result.current.removeLinesById(['line-b']);
      });

      // lineA should no longer have connections
      expect(result.current.connections['line-a']).toBeDefined();
      expect(result.current.connections['line-a'].b).toHaveLength(0);
      expect(result.current.connections['line-b']).toBeUndefined();
    });

    it('should return correct connections via getConnectedEndpoints callback', () => {
      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 100, y: 0 },
        b: { x: 100, y: 100 },
      });

      const { result } = renderHook(() => useLineStore([lineA, lineB]));

      // Get connections for lineA.b
      const connectionsAtB = result.current.getConnectedEndpoints('line-a', 'b');
      expect(connectionsAtB).toHaveLength(1);
      expect(connectionsAtB[0]).toEqual({
        lineId: 'line-b',
        endpoint: 'a',
      });

      // Get connections for lineA.a (should be empty)
      const connectionsAtA = result.current.getConnectedEndpoints('line-a', 'a');
      expect(connectionsAtA).toHaveLength(0);
    });

    it('should handle multi-branch junctions (3+ lines)', () => {
      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 100, y: 100 },
        b: { x: 200, y: 200 },
      });
      const lineC = createLine({
        id: 'line-c',
        a: { x: 100, y: 100 },
        b: { x: 300, y: 300 },
      });

      const { result } = renderHook(() => useLineStore([lineA, lineB, lineC]));

      // All three should be connected at (100, 100)
      expect(result.current.connections['line-a'].b).toHaveLength(2);
      expect(result.current.connections['line-b'].a).toHaveLength(2);
      expect(result.current.connections['line-c'].a).toHaveLength(2);
    });

    it('should memoize connections (only recompute when lines change)', () => {
      const lineA = createLine({ id: 'line-a' });
      const { result, rerender } = renderHook(() => useLineStore([lineA]));

      const firstConnections = result.current.connections;

      // Rerender without changing lines
      rerender();

      // Should be the same reference (memoized)
      expect(result.current.connections).toBe(firstConnections);

      // Add a line
      act(() => {
        result.current.addLine(createLine({ id: 'line-b' }));
      });

      // Should be a different reference
      expect(result.current.connections).not.toBe(firstConnections);
    });

    it('should return empty array for non-existent line in getConnectedEndpoints', () => {
      const { result } = renderHook(() => useLineStore());

      const connections = result.current.getConnectedEndpoints('non-existent', 'a');
      expect(connections).toEqual([]);
    });

    it('should handle isolated lines (no connections)', () => {
      const lineA = createLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 200, y: 200 },
        b: { x: 300, y: 200 },
      });

      const { result } = renderHook(() => useLineStore([lineA, lineB]));

      // Both lines should have no connections
      expect(result.current.connections['line-a'].a).toHaveLength(0);
      expect(result.current.connections['line-a'].b).toHaveLength(0);
      expect(result.current.connections['line-b'].a).toHaveLength(0);
      expect(result.current.connections['line-b'].b).toHaveLength(0);
    });
  });
});
