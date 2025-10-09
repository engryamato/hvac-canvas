/**
 * Canvas utilities tests
 */

import { describe, it, expect } from 'vitest';
import { screenToCanvas, canvasToScreen } from '../canvas';
import type { ViewportTransform } from '../../types';

describe('Canvas Utilities', () => {
  describe('screenToCanvas', () => {
    it('should convert screen coordinates to canvas coordinates with no transform', () => {
      const transform: ViewportTransform = { scale: 1.0, offset: { x: 0, y: 0 } };
      const result = screenToCanvas(100, 100, transform);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should account for scale (zoom)', () => {
      const transform: ViewportTransform = { scale: 2.0, offset: { x: 0, y: 0 } };
      const result = screenToCanvas(100, 100, transform);
      expect(result).toEqual({ x: 50, y: 50 });
    });

    it('should account for offset (pan)', () => {
      const transform: ViewportTransform = { scale: 1.0, offset: { x: 50, y: 50 } };
      const result = screenToCanvas(100, 100, transform);
      expect(result).toEqual({ x: 50, y: 50 });
    });

    it('should account for both scale and offset', () => {
      const transform: ViewportTransform = { scale: 2.0, offset: { x: 50, y: 50 } };
      const result = screenToCanvas(100, 100, transform);
      expect(result).toEqual({ x: 25, y: 25 });
    });

    it('should handle zoom out (scale < 1)', () => {
      const transform: ViewportTransform = { scale: 0.5, offset: { x: 0, y: 0 } };
      const result = screenToCanvas(100, 100, transform);
      expect(result).toEqual({ x: 200, y: 200 });
    });
  });

  describe('canvasToScreen', () => {
    it('should convert canvas coordinates to screen coordinates with no transform', () => {
      const transform: ViewportTransform = { scale: 1.0, offset: { x: 0, y: 0 } };
      const result = canvasToScreen(100, 100, transform);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should account for scale (zoom)', () => {
      const transform: ViewportTransform = { scale: 2.0, offset: { x: 0, y: 0 } };
      const result = canvasToScreen(50, 50, transform);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should account for offset (pan)', () => {
      const transform: ViewportTransform = { scale: 1.0, offset: { x: 50, y: 50 } };
      const result = canvasToScreen(50, 50, transform);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should account for both scale and offset', () => {
      const transform: ViewportTransform = { scale: 2.0, offset: { x: 50, y: 50 } };
      const result = canvasToScreen(25, 25, transform);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should be inverse of screenToCanvas', () => {
      const transform: ViewportTransform = { scale: 1.5, offset: { x: 30, y: 40 } };
      const screenPoint = { x: 123, y: 456 };
      
      const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y, transform);
      const backToScreen = canvasToScreen(canvasPoint.x, canvasPoint.y, transform);
      
      expect(backToScreen.x).toBeCloseTo(screenPoint.x);
      expect(backToScreen.y).toBeCloseTo(screenPoint.y);
    });
  });
});

