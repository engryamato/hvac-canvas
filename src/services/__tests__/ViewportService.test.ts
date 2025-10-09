/**
 * Viewport Service tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateZoom,
  canZoomIn,
  canZoomOut,
  calculateZoomOffset,
  calculatePanOffset,
  calculatePinchZoomOffset,
  resetViewport,
  transformScreenToCanvas,
  transformCanvasToScreen,
} from '../viewport/ViewportService';
import type { ViewportTransform } from '../../types';

describe('ViewportService', () => {
  describe('calculateZoom', () => {
    it('should zoom in by ZOOM_FACTOR', () => {
      const newZoom = calculateZoom(1.0, 'in');
      expect(newZoom).toBeCloseTo(1.1);
    });

    it('should zoom out by ZOOM_FACTOR', () => {
      const newZoom = calculateZoom(1.1, 'out');
      expect(newZoom).toBeCloseTo(1.0);
    });

    it('should clamp to MAX_ZOOM', () => {
      const newZoom = calculateZoom(9.5, 'in');
      expect(newZoom).toBe(10.0);
    });

    it('should clamp to MIN_ZOOM', () => {
      const newZoom = calculateZoom(0.11, 'out');
      expect(newZoom).toBe(0.1);
    });
  });

  describe('canZoomIn', () => {
    it('should return true when below MAX_ZOOM', () => {
      expect(canZoomIn(1.0)).toBe(true);
      expect(canZoomIn(9.9)).toBe(true);
    });

    it('should return false when at MAX_ZOOM', () => {
      expect(canZoomIn(10.0)).toBe(false);
    });
  });

  describe('canZoomOut', () => {
    it('should return true when above MIN_ZOOM', () => {
      expect(canZoomOut(1.0)).toBe(true);
      expect(canZoomOut(0.2)).toBe(true);
    });

    it('should return false when at MIN_ZOOM', () => {
      expect(canZoomOut(0.1)).toBe(false);
    });
  });

  describe('calculateZoomOffset', () => {
    it('should keep mouse position fixed during zoom', () => {
      const mousePos = { x: 400, y: 300 };
      const currentTransform: ViewportTransform = {
        scale: 1.0,
        offset: { x: 0, y: 0 }
      };
      const newZoom = 2.0;
      
      const newOffset = calculateZoomOffset(mousePos, currentTransform, newZoom);
      
      // Mouse position in canvas space should remain the same
      const canvasBefore = (mousePos.x - currentTransform.offset.x) / currentTransform.scale;
      const canvasAfter = (mousePos.x - newOffset.x) / newZoom;
      
      expect(canvasAfter).toBeCloseTo(canvasBefore);
    });

    it('should handle zoom with existing offset', () => {
      const mousePos = { x: 400, y: 300 };
      const currentTransform: ViewportTransform = {
        scale: 1.5,
        offset: { x: 50, y: 50 }
      };
      const newZoom = 2.0;
      
      const newOffset = calculateZoomOffset(mousePos, currentTransform, newZoom);
      
      expect(newOffset.x).toBeDefined();
      expect(newOffset.y).toBeDefined();
    });
  });

  describe('calculatePanOffset', () => {
    it('should calculate pan offset from drag delta', () => {
      const panStart = { x: 100, y: 100 };
      const panCurrent = { x: 150, y: 120 };
      const panOffsetStart = { x: 0, y: 0 };
      
      const newOffset = calculatePanOffset(panStart, panCurrent, panOffsetStart);
      
      expect(newOffset).toEqual({ x: 50, y: 20 });
    });

    it('should add to existing offset', () => {
      const panStart = { x: 100, y: 100 };
      const panCurrent = { x: 150, y: 120 };
      const panOffsetStart = { x: 10, y: 5 };
      
      const newOffset = calculatePanOffset(panStart, panCurrent, panOffsetStart);
      
      expect(newOffset).toEqual({ x: 60, y: 25 });
    });

    it('should handle negative delta', () => {
      const panStart = { x: 100, y: 100 };
      const panCurrent = { x: 50, y: 80 };
      const panOffsetStart = { x: 0, y: 0 };
      
      const newOffset = calculatePanOffset(panStart, panCurrent, panOffsetStart);
      
      expect(newOffset).toEqual({ x: -50, y: -20 });
    });
  });

  describe('calculatePinchZoomOffset', () => {
    it('should keep pinch center fixed during pinch zoom', () => {
      const pinchCenter = { x: 400, y: 300 };
      const touchStartOffset = { x: 0, y: 0 };
      const touchStartScale = 1.0;
      const newScale = 2.0;
      
      const newOffset = calculatePinchZoomOffset(
        pinchCenter,
        touchStartOffset,
        touchStartScale,
        newScale
      );
      
      // Pinch center in canvas space should remain the same
      const canvasBefore = (pinchCenter.x - touchStartOffset.x) / touchStartScale;
      const canvasAfter = (pinchCenter.x - newOffset.x) / newScale;
      
      expect(canvasAfter).toBeCloseTo(canvasBefore);
    });
  });

  describe('resetViewport', () => {
    it('should return default viewport transform', () => {
      const transform = resetViewport();
      
      expect(transform.scale).toBe(1.0);
      expect(transform.offset).toEqual({ x: 0, y: 0 });
    });
  });

  describe('transformScreenToCanvas', () => {
    it('should transform screen point to canvas coordinates', () => {
      const screenPoint = { x: 100, y: 100 };
      const transform: ViewportTransform = {
        scale: 2.0,
        offset: { x: 50, y: 50 }
      };
      
      const canvasPoint = transformScreenToCanvas(screenPoint, transform);
      
      expect(canvasPoint).toEqual({ x: 25, y: 25 });
    });

    it('should handle identity transform', () => {
      const screenPoint = { x: 100, y: 100 };
      const transform: ViewportTransform = {
        scale: 1.0,
        offset: { x: 0, y: 0 }
      };
      
      const canvasPoint = transformScreenToCanvas(screenPoint, transform);
      
      expect(canvasPoint).toEqual({ x: 100, y: 100 });
    });
  });

  describe('transformCanvasToScreen', () => {
    it('should transform canvas point to screen coordinates', () => {
      const canvasPoint = { x: 25, y: 25 };
      const transform: ViewportTransform = {
        scale: 2.0,
        offset: { x: 50, y: 50 }
      };
      
      const screenPoint = transformCanvasToScreen(canvasPoint, transform);
      
      expect(screenPoint).toEqual({ x: 100, y: 100 });
    });

    it('should be inverse of transformScreenToCanvas', () => {
      const screenPoint = { x: 123, y: 456 };
      const transform: ViewportTransform = {
        scale: 1.5,
        offset: { x: 30, y: 40 }
      };
      
      const canvasPoint = transformScreenToCanvas(screenPoint, transform);
      const backToScreen = transformCanvasToScreen(canvasPoint, transform);
      
      expect(backToScreen.x).toBeCloseTo(screenPoint.x);
      expect(backToScreen.y).toBeCloseTo(screenPoint.y);
    });
  });
});

