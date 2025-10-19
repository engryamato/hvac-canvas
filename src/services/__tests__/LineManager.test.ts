/**
 * Line Manager tests
 */

import { describe, it, expect } from 'vitest';
import {
  addLine,
  removeLine,
  removeLines,
  updateLineWidth,
  updateLineColor,
  updateLineLength,
  findLineById,
  getLinesByWidth,
  getUniqueWidths,
} from '../drawing/LineManager';
import type { Line } from '../../types';
import { dist } from '../../utils/geometry';

describe('LineManager', () => {
  const testLines: Line[] = [
    { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, width: 8, color: '#111827' },
    { id: '2', a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, width: 12, color: '#111827' },
    { id: '3', a: { x: 100, y: 0 }, b: { x: 100, y: 100 }, width: 8, color: '#FF0000' },
  ];

  describe('addLine', () => {
    it('should add a line to collection', () => {
      const newLine: Line = {
        id: '4',
        a: { x: 50, y: 50 },
        b: { x: 150, y: 150 },
        width: 10,
        color: '#00FF00'
      };
      
      const result = addLine(testLines, newLine);
      expect(result.length).toBe(4);
      expect(result[3]).toBe(newLine);
    });

    it('should not mutate original array', () => {
      const newLine: Line = {
        id: '4',
        a: { x: 50, y: 50 },
        b: { x: 150, y: 150 },
        width: 10,
        color: '#00FF00'
      };
      
      const result = addLine(testLines, newLine);
      expect(testLines.length).toBe(3);
      expect(result).not.toBe(testLines);
    });
  });

  describe('removeLine', () => {
    it('should remove a line by ID', () => {
      const result = removeLine(testLines, '2');
      expect(result.length).toBe(2);
      expect(result.find(l => l.id === '2')).toBeUndefined();
    });

    it('should not mutate original array', () => {
      const result = removeLine(testLines, '2');
      expect(testLines.length).toBe(3);
      expect(result).not.toBe(testLines);
    });

    it('should return same length if ID not found', () => {
      const result = removeLine(testLines, 'nonexistent');
      expect(result.length).toBe(3);
    });
  });

  describe('removeLines', () => {
    it('should remove multiple lines by ID', () => {
      const result = removeLines(testLines, ['1', '3']);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('2');
    });

    it('should return a copy when no IDs provided', () => {
      const result = removeLines(testLines, []);
      expect(result).not.toBe(testLines);
      expect(result).toEqual(testLines);
    });

    it('should ignore IDs that do not exist', () => {
      const result = removeLines(testLines, ['does-not-exist']);
      expect(result).not.toBe(testLines);
      expect(result).toEqual(testLines);
    });
  });

  describe('updateLineWidth', () => {
    it('should update line width by ID', () => {
      const result = updateLineWidth(testLines, '1', () => 16);
      const updatedLine = result.find(l => l.id === '1');
      expect(updatedLine!.width).toBe(16);
    });

    it('should use updater function with current width', () => {
      const result = updateLineWidth(testLines, '1', w => w + 2);
      const updatedLine = result.find(l => l.id === '1');
      expect(updatedLine!.width).toBe(10); // 8 + 2
    });

    it('should clamp width to valid range', () => {
      const result = updateLineWidth(testLines, '1', () => 100);
      const updatedLine = result.find(l => l.id === '1');
      expect(updatedLine!.width).toBe(60);
    });

    it('should not mutate original array', () => {
      const result = updateLineWidth(testLines, '1', () => 16);
      expect(testLines[0].width).toBe(8);
      expect(result).not.toBe(testLines);
    });
  });

  describe('updateLineColor', () => {
    it('should update line color by ID', () => {
      const result = updateLineColor(testLines, '1', '#00FF00');
      const updatedLine = result.find(l => l.id === '1');
      expect(updatedLine!.color).toBe('#00FF00');
    });

    it('should not mutate original array', () => {
      const result = updateLineColor(testLines, '1', '#00FF00');
      expect(testLines[0].color).toBe('#111827');
      expect(result).not.toBe(testLines);
    });
  });

  describe('findLineById', () => {
    it('should find line by ID', () => {
      const line = findLineById(testLines, '2');
      expect(line).toBeDefined();
      expect(line!.id).toBe('2');
    });

    it('should return undefined if not found', () => {
      const line = findLineById(testLines, 'nonexistent');
      expect(line).toBeUndefined();
    });
  });

  describe('getLinesByWidth', () => {
    it('should get all lines with specific width', () => {
      const lines = getLinesByWidth(testLines, 8);
      expect(lines.length).toBe(2);
      expect(lines.every(l => l.width === 8)).toBe(true);
    });

    it('should return empty array if no matches', () => {
      const lines = getLinesByWidth(testLines, 99);
      expect(lines.length).toBe(0);
    });
  });

  describe('getUniqueWidths', () => {
    it('should get all unique widths sorted', () => {
      const widths = getUniqueWidths(testLines);
      expect(widths).toEqual([8, 12]);
    });

    it('should return empty array for empty collection', () => {
      const widths = getUniqueWidths([]);
      expect(widths).toEqual([]);
    });

    it('should handle single width', () => {
      const singleWidthLines = [testLines[0]];
      const widths = getUniqueWidths(singleWidthLines);
      expect(widths).toEqual([8]);
    });
  });

  describe('updateLineLength', () => {
    it('should update line length while keeping endpoint a fixed', () => {
      // Line from (0,0) to (100,0) - horizontal line, length 100
      const lines: Line[] = [
        { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, width: 8, color: '#111827' }
      ];

      const result = updateLineLength(lines, '1', 200);
      const updatedLine = result.find(l => l.id === '1');

      // Endpoint a should remain the same
      expect(updatedLine!.a).toEqual({ x: 0, y: 0 });

      // Endpoint b should be at (200, 0) - same direction, new length
      expect(updatedLine!.b.x).toBeCloseTo(200, 5);
      expect(updatedLine!.b.y).toBeCloseTo(0, 5);

      // Verify actual length
      const actualLength = dist(updatedLine!.a, updatedLine!.b);
      expect(actualLength).toBeCloseTo(200, 5);
    });

    it('should maintain line angle when updating length', () => {
      // Diagonal line at 45 degrees
      const lines: Line[] = [
        { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 100 }, width: 8, color: '#111827' }
      ];

      const newLength = 200;

      const result = updateLineLength(lines, '1', newLength);
      const updatedLine = result.find(l => l.id === '1');

      // Endpoint a should remain the same
      expect(updatedLine!.a).toEqual({ x: 0, y: 0 });

      // Calculate expected endpoint b (45 degree angle, length 200)
      const expectedX = newLength * Math.cos(Math.PI / 4); // ~141.42
      const expectedY = newLength * Math.sin(Math.PI / 4); // ~141.42

      expect(updatedLine!.b.x).toBeCloseTo(expectedX, 5);
      expect(updatedLine!.b.y).toBeCloseTo(expectedY, 5);

      // Verify actual length
      const actualLength = dist(updatedLine!.a, updatedLine!.b);
      expect(actualLength).toBeCloseTo(newLength, 5);
    });

    it('should enforce minimum length', () => {
      const lines: Line[] = [
        { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, width: 8, color: '#111827' }
      ];

      // Try to set length to 1 pixel (below MIN_LINE_LENGTH of 2)
      const result = updateLineLength(lines, '1', 1);
      const updatedLine = result.find(l => l.id === '1');

      const actualLength = dist(updatedLine!.a, updatedLine!.b);
      expect(actualLength).toBeGreaterThanOrEqual(2); // MIN_LINE_LENGTH
    });

    it('should handle zero-length lines gracefully', () => {
      const lines: Line[] = [
        { id: '1', a: { x: 50, y: 50 }, b: { x: 50, y: 50 }, width: 8, color: '#111827' }
      ];

      // Should not crash, should keep line as-is
      const result = updateLineLength(lines, '1', 100);
      const updatedLine = result.find(l => l.id === '1');

      // Line should remain unchanged since we can't determine direction
      expect(updatedLine!.a).toEqual({ x: 50, y: 50 });
      expect(updatedLine!.b).toEqual({ x: 50, y: 50 });
    });

    it('should not mutate original array', () => {
      const lines: Line[] = [
        { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, width: 8, color: '#111827' }
      ];

      const originalB = { ...lines[0].b };
      const result = updateLineLength(lines, '1', 200);

      // Original should be unchanged
      expect(lines[0].b).toEqual(originalB);
      expect(result).not.toBe(lines);
    });

    it('should only update the specified line', () => {
      const lines: Line[] = [
        { id: '1', a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, width: 8, color: '#111827' },
        { id: '2', a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, width: 12, color: '#111827' }
      ];

      const result = updateLineLength(lines, '1', 200);

      // Line 1 should be updated
      const line1 = result.find(l => l.id === '1');
      expect(dist(line1!.a, line1!.b)).toBeCloseTo(200, 5);

      // Line 2 should remain unchanged
      const line2 = result.find(l => l.id === '2');
      expect(dist(line2!.a, line2!.b)).toBeCloseTo(100, 5);
    });
  });
});
