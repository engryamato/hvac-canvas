/**
 * Snap utilities tests
 */

import { describe, it, expect } from 'vitest';
import { findSnapTarget, resolveSnapPoint } from '../snap';
import type { Line, SnapTarget } from '../../types';

describe('Snap Utilities', () => {
  const testLines: Line[] = [
    {
      id: 'line1',
      a: { x: 0, y: 0 },
      b: { x: 100, y: 0 },
      width: 8,
      color: '#000'
    },
    {
      id: 'line2',
      a: { x: 100, y: 0 },
      b: { x: 100, y: 100 },
      width: 8,
      color: '#000'
    }
  ];

  describe('findSnapTarget', () => {
    it('should find endpoint snap within threshold', () => {
      const cursor = { x: -5, y: 5 }; // Within 20px of (0, 0), but off the line
      const result = findSnapTarget(cursor, testLines);

      expect(result).not.toBeNull();
      expect(result!.type).toBe('endpoint');
      expect(result!.point).toEqual({ x: 0, y: 0 });
      expect(result!.lineId).toBe('line1');
    });

    it('should find midpoint snap within threshold', () => {
      const cursor = { x: 50, y: 5 }; // Within 18px of midpoint (50, 0)
      const result = findSnapTarget(cursor, testLines);
      
      expect(result).not.toBeNull();
      expect(result!.type).toBe('midpoint');
      expect(result!.point).toEqual({ x: 50, y: 0 });
    });

    it('should find line snap within threshold', () => {
      const cursor = { x: 25, y: 10 }; // Within 15px of line
      const result = findSnapTarget(cursor, testLines);
      
      expect(result).not.toBeNull();
      expect(result!.type).toBe('line');
      expect(result!.point.x).toBeCloseTo(25);
      expect(result!.point.y).toBeCloseTo(0);
    });

    it('should return null when no snap target within threshold', () => {
      const cursor = { x: 500, y: 500 }; // Far from any line
      const result = findSnapTarget(cursor, testLines);
      
      expect(result).toBeNull();
    });

    it('should exclude specified line', () => {
      const cursor = { x: 5, y: 5 };
      const result = findSnapTarget(cursor, testLines, 'line1');
      
      // Should not snap to line1's endpoint, might snap to line2 if close enough
      if (result) {
        expect(result.lineId).not.toBe('line1');
      }
    });

    it('should return closest snap when multiple candidates', () => {
      const cursor = { x: 98, y: 2 }; // Close to endpoint (100, 0)
      const result = findSnapTarget(cursor, testLines);
      
      expect(result).not.toBeNull();
      // Should snap to the closest point
      expect(result!.distance).toBeLessThan(5);
    });

    it('should prioritize closer snap over type', () => {
      const cursor = { x: -1, y: 1 }; // Very close to endpoint (0, 0), off the line
      const result = findSnapTarget(cursor, testLines);

      expect(result).not.toBeNull();
      expect(result!.type).toBe('endpoint');
      expect(result!.point).toEqual({ x: 0, y: 0 });
    });
  });

  describe('resolveSnapPoint', () => {
    it('should return snap point when snap target exists', () => {
      const rawPoint = { x: 10, y: 10 };
      const snapTarget: SnapTarget = {
        lineId: 'line1',
        point: { x: 0, y: 0 },
        type: 'endpoint',
        distance: 5
      };
      
      const result = resolveSnapPoint(rawPoint, snapTarget);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should return raw point when no snap target', () => {
      const rawPoint = { x: 10, y: 10 };
      const result = resolveSnapPoint(rawPoint, null);
      
      expect(result).toEqual({ x: 10, y: 10 });
    });
  });
});

