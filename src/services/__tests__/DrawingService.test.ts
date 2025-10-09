/**
 * Drawing Service tests
 */

import { describe, it, expect } from 'vitest';
import {
  createLine,
  validateLine,
  calculateLineLength,
  updateLineWidth,
  updateLineColor,
} from '../drawing/DrawingService';
import type { Line } from '../../types';

describe('DrawingService', () => {
  describe('createLine', () => {
    it('should create a valid line', () => {
      const result = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      });
      
      expect(result.success).toBe(true);
      expect(result.line).toBeDefined();
      expect(result.line!.a).toEqual({ x: 0, y: 0 });
      expect(result.line!.b).toEqual({ x: 100, y: 100 });
      expect(result.line!.width).toBe(8);
      expect(result.line!.color).toBe('#111827');
      expect(result.line!.id).toBeDefined();
    });

    it('should reject line that is too short', () => {
      const result = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 1, y: 1 },
        width: 8,
        color: '#111827'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('too short');
      expect(result.line).toBeUndefined();
    });

    it('should reject line with invalid width (too small)', () => {
      const result = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 100, y: 100 },
        width: 0,
        color: '#111827'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('width');
      expect(result.line).toBeUndefined();
    });

    it('should reject line with invalid width (too large)', () => {
      const result = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 100, y: 100 },
        width: 61,
        color: '#111827'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('width');
      expect(result.line).toBeUndefined();
    });

    it('should generate unique IDs for each line', () => {
      const result1 = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      });
      
      const result2 = createLine({
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      });
      
      expect(result1.line!.id).not.toBe(result2.line!.id);
    });
  });

  describe('validateLine', () => {
    it('should validate a valid line', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      };
      
      expect(validateLine(line)).toBe(true);
    });

    it('should reject line that is too short', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 1, y: 1 },
        width: 8,
        color: '#111827'
      };
      
      expect(validateLine(line)).toBe(false);
    });

    it('should reject line with invalid width', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 0,
        color: '#111827'
      };
      
      expect(validateLine(line)).toBe(false);
    });
  });

  describe('calculateLineLength', () => {
    it('should calculate line length', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 3, y: 4 },
        width: 8,
        color: '#111827'
      };
      
      expect(calculateLineLength(line)).toBe(5);
    });
  });

  describe('updateLineWidth', () => {
    it('should update line width', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      };
      
      const updated = updateLineWidth(line, 12);
      expect(updated.width).toBe(12);
      expect(updated.id).toBe(line.id);
    });

    it('should clamp width to minimum', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      };
      
      const updated = updateLineWidth(line, 0);
      expect(updated.width).toBe(1);
    });

    it('should clamp width to maximum', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      };
      
      const updated = updateLineWidth(line, 100);
      expect(updated.width).toBe(60);
    });
  });

  describe('updateLineColor', () => {
    it('should update line color', () => {
      const line: Line = {
        id: '1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 100 },
        width: 8,
        color: '#111827'
      };
      
      const updated = updateLineColor(line, '#FF0000');
      expect(updated.color).toBe('#FF0000');
      expect(updated.id).toBe(line.id);
    });
  });
});

