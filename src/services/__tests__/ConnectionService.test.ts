/**
 * Connection Service tests
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeCoordinate,
  buildConnectionGraph,
  getConnectedEndpoints,
  getConnectionsForLine,
} from '../drawing/ConnectionService';
import type { Line } from '../../types';

/**
 * Helper function to create a test line
 */
function createTestLine(overrides: Partial<Line> = {}): Line {
  return {
    id: 'test-line',
    a: { x: 0, y: 0 },
    b: { x: 100, y: 0 },
    width: 8,
    color: '#111827',
    type: 'supply',
    layer: 'Default',
    material: 'Galvanized Steel',
    gauge: '26ga',
    airflow: 0,
    notes: '',
    tags: [],
    customProperties: {},
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    ...overrides,
  };
}

describe('ConnectionService', () => {
  describe('normalizeCoordinate', () => {
    it('should normalize coordinate to nearest tolerance bucket', () => {
      expect(normalizeCoordinate(105, 20)).toBe(100);
      expect(normalizeCoordinate(115, 20)).toBe(120);
      expect(normalizeCoordinate(100, 20)).toBe(100);
    });

    it('should handle edge cases at tolerance boundaries', () => {
      expect(normalizeCoordinate(10, 20)).toBe(20); // 10/20 = 0.5, rounds to 1, 1*20 = 20
      expect(normalizeCoordinate(19, 20)).toBe(20); // 19/20 = 0.95, rounds to 1, 1*20 = 20
      expect(normalizeCoordinate(20, 20)).toBe(20);
    });

    it('should handle negative coordinates', () => {
      expect(normalizeCoordinate(-105, 20)).toBe(-100);
      expect(normalizeCoordinate(-115, 20)).toBe(-120);
    });

    it('should handle zero', () => {
      expect(normalizeCoordinate(0, 20)).toBe(0);
    });

    it('should work with different tolerance values', () => {
      expect(normalizeCoordinate(105, 10)).toBe(110); // 105/10 = 10.5, rounds to 11, 11*10 = 110
      expect(normalizeCoordinate(105, 50)).toBe(100); // 105/50 = 2.1, rounds to 2, 2*50 = 100
    });
  });

  describe('buildConnectionGraph', () => {
    it('should detect connection between two lines at same endpoint', () => {
      const lineA = createTestLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 100, y: 0 },
        b: { x: 100, y: 100 },
      });

      const graph = buildConnectionGraph([lineA, lineB], 20);

      // lineA.b should connect to lineB.a
      expect(graph['line-a'].b).toContainEqual({
        lineId: 'line-b',
        endpoint: 'a',
      });
      expect(graph['line-b'].a).toContainEqual({
        lineId: 'line-a',
        endpoint: 'b',
      });
    });

    it('should handle multi-branch junctions (3+ lines)', () => {
      const lineA = createTestLine({
        id: 'line-a',
        b: { x: 100, y: 100 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 100, y: 100 },
      });
      const lineC = createTestLine({
        id: 'line-c',
        a: { x: 100, y: 100 },
      });

      const graph = buildConnectionGraph([lineA, lineB, lineC], 20);

      // All three should be connected at that point
      expect(graph['line-a'].b).toHaveLength(2);
      expect(graph['line-b'].a).toHaveLength(2);
      expect(graph['line-c'].a).toHaveLength(2);
    });

    it('should not create connections for isolated lines', () => {
      const lineA = createTestLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 200, y: 200 },
        b: { x: 300, y: 200 },
      });

      const graph = buildConnectionGraph([lineA, lineB], 20);

      expect(graph['line-a'].a).toHaveLength(0);
      expect(graph['line-a'].b).toHaveLength(0);
      expect(graph['line-b'].a).toHaveLength(0);
      expect(graph['line-b'].b).toHaveLength(0);
    });

    it('should respect tolerance boundaries', () => {
      const lineA = createTestLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 119, y: 0 }, // Within 20px tolerance of 100
        b: { x: 200, y: 0 },
      });

      const graph = buildConnectionGraph([lineA, lineB], 20);

      // Should be connected (119 normalizes to 120, 100 normalizes to 100, but they're in different buckets)
      // Actually: 100 normalizes to 100, 119 normalizes to 120, so they DON'T connect
      expect(graph['line-a'].b).toHaveLength(0);
    });

    it('should initialize all lines in graph even with no connections', () => {
      const lineA = createTestLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 200, y: 200 }, // Far away, no connection
        b: { x: 300, y: 200 },
      });

      const graph = buildConnectionGraph([lineA, lineB], 20);

      expect(graph['line-a']).toBeDefined();
      expect(graph['line-b']).toBeDefined();
      expect(graph['line-a'].a).toEqual([]);
      expect(graph['line-a'].b).toEqual([]);
    });

    it('should handle empty line array', () => {
      const graph = buildConnectionGraph([], 20);
      expect(graph).toEqual({});
    });

    it('should handle single line', () => {
      const lineA = createTestLine({ id: 'line-a' });
      const graph = buildConnectionGraph([lineA], 20);

      expect(graph['line-a']).toBeDefined();
      expect(graph['line-a'].a).toHaveLength(0);
      expect(graph['line-a'].b).toHaveLength(0);
    });
  });

  describe('getConnectedEndpoints', () => {
    it('should return connections for specific endpoint', () => {
      const lineA = createTestLine({
        id: 'line-a',
        b: { x: 100, y: 100 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 100, y: 100 },
      });

      const graph = buildConnectionGraph([lineA, lineB], 20);
      const connections = getConnectedEndpoints(graph, 'line-a', 'b');

      expect(connections).toHaveLength(1);
      expect(connections[0]).toEqual({
        lineId: 'line-b',
        endpoint: 'a',
      });
    });

    it('should return empty array for unconnected endpoint', () => {
      const lineA = createTestLine({ id: 'line-a' });
      const graph = buildConnectionGraph([lineA], 20);

      const connections = getConnectedEndpoints(graph, 'line-a', 'a');
      expect(connections).toEqual([]);
    });

    it('should return empty array for non-existent line', () => {
      const graph = buildConnectionGraph([], 20);
      const connections = getConnectedEndpoints(graph, 'non-existent', 'a');
      expect(connections).toEqual([]);
    });
  });

  describe('getConnectionsForLine', () => {
    it('should return all connections for a line', () => {
      const lineA = createTestLine({
        id: 'line-a',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
      });
      const lineB = createTestLine({
        id: 'line-b',
        a: { x: 0, y: 0 },
        b: { x: 200, y: 200 },
      });
      const lineC = createTestLine({
        id: 'line-c',
        a: { x: 100, y: 100 },
        b: { x: 300, y: 300 },
      });

      const graph = buildConnectionGraph([lineA, lineB, lineC], 20);
      const connections = getConnectionsForLine(graph, 'line-a');

      expect(connections).toBeDefined();
      expect(connections!.a).toHaveLength(1);
      expect(connections!.b).toHaveLength(1);
    });

    it('should return null for non-existent line', () => {
      const graph = buildConnectionGraph([], 20);
      const connections = getConnectionsForLine(graph, 'non-existent');
      expect(connections).toBeNull();
    });

    it('should return empty connections for isolated line', () => {
      const lineA = createTestLine({ id: 'line-a' });
      const graph = buildConnectionGraph([lineA], 20);

      const connections = getConnectionsForLine(graph, 'line-a');
      expect(connections).toEqual({ a: [], b: [] });
    });
  });
});

