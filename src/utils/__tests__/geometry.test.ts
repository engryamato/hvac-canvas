/**
 * Geometry utilities tests
 */

import { describe, it, expect } from 'vitest';
import { dist, midpoint, getClosestPointOnSegment, getLineLength } from '../geometry';
import type { Line } from '../../types';

describe('Geometry Utilities', () => {
  describe('dist', () => {
    it('should calculate distance between two points', () => {
      const result = dist({ x: 0, y: 0 }, { x: 3, y: 4 });
      expect(result).toBe(5);
    });

    it('should return 0 for same point', () => {
      const result = dist({ x: 5, y: 5 }, { x: 5, y: 5 });
      expect(result).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const result = dist({ x: -3, y: -4 }, { x: 0, y: 0 });
      expect(result).toBe(5);
    });
  });

  describe('midpoint', () => {
    it('should calculate midpoint between two points', () => {
      const result = midpoint({ x: 0, y: 0 }, { x: 10, y: 10 });
      expect(result).toEqual({ x: 5, y: 5 });
    });

    it('should handle negative coordinates', () => {
      const result = midpoint({ x: -10, y: -10 }, { x: 10, y: 10 });
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle decimal values', () => {
      const result = midpoint({ x: 0, y: 0 }, { x: 5, y: 5 });
      expect(result).toEqual({ x: 2.5, y: 2.5 });
    });
  });

  describe('getClosestPointOnSegment', () => {
    it('should return point on segment when perpendicular projection is within segment', () => {
      const result = getClosestPointOnSegment(
        { x: 5, y: 5 },
        { x: 0, y: 0 },
        { x: 10, y: 0 }
      );
      expect(result).toEqual({ x: 5, y: 0 });
    });

    it('should return start point when projection is before segment', () => {
      const result = getClosestPointOnSegment(
        { x: -5, y: 5 },
        { x: 0, y: 0 },
        { x: 10, y: 0 }
      );
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should return end point when projection is after segment', () => {
      const result = getClosestPointOnSegment(
        { x: 15, y: 5 },
        { x: 0, y: 0 },
        { x: 10, y: 0 }
      );
      expect(result).toEqual({ x: 10, y: 0 });
    });

    it('should handle segment as a point', () => {
      const result = getClosestPointOnSegment(
        { x: 5, y: 5 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      );
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle diagonal segments', () => {
      const result = getClosestPointOnSegment(
        { x: 5, y: 0 },
        { x: 0, y: 0 },
        { x: 10, y: 10 }
      );
      expect(result.x).toBeCloseTo(2.5);
      expect(result.y).toBeCloseTo(2.5);
    });
  });

  describe('getLineLength', () => {
    it('should calculate length of a line', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 3, y: 4 },
        width: 8,
        color: '#000'
      };
      expect(getLineLength(line)).toBe(5);
    });

    it('should return 0 for zero-length line', () => {
      const line: Line = {
        id: '1',
        a: { x: 5, y: 5 },
        b: { x: 5, y: 5 },
        width: 8,
        color: '#000'
      };
      expect(getLineLength(line)).toBe(0);
    });
  });
});

