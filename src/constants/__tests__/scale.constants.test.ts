/**
 * Scale constants tests
 * 
 * Verifies that all predefined scales work correctly with the 64px = 1" base conversion
 */

import { describe, it, expect } from 'vitest';
import { ARCHITECTURAL_SCALES, ENGINEERING_SCALES, METRIC_SCALES } from '../scale.constants';
import { pixelsToInches } from '../../utils/scale';

const BASE_PIXELS_PER_INCH = 64;

describe('Scale Constants', () => {
  describe('Base Conversion', () => {
    it('should use 64 pixels = 1 inch as base', () => {
      // At 1:1 scale (metric), 64 pixels should equal 1 inch
      const scale1to1 = METRIC_SCALES.find(s => s.displayName === '1:1');
      expect(scale1to1).toBeDefined();
      expect(scale1to1!.pixelsPerInch).toBe(BASE_PIXELS_PER_INCH);
      
      // Verify: 64 pixels = 1 inch
      const inches = pixelsToInches(64, scale1to1!);
      expect(inches).toBe(1);
    });
  });

  describe('Architectural Scales', () => {
    it('should have 6 architectural scales', () => {
      expect(ARCHITECTURAL_SCALES).toHaveLength(6);
    });

    it('1/16" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '1/16" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 1/16" on drawing = 12" in reality
      // So 1" on drawing = 192" in reality
      // With 64px = 1" base: 64 pixels on screen = 1" on drawing = 192" in reality
      // Therefore: pixelsPerInch should be 64/192 = 1/3
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 192, 5);
      
      // Verify: 64 pixels should represent 192 inches in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(192, 5);
    });

    it('1/8" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '1/8" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 1/8" on drawing = 12" in reality
      // So 1" on drawing = 96" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 96, 5);
      
      // Verify: 64 pixels should represent 96 inches in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(96, 5);
    });

    it('1/4" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '1/4" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 1/4" on drawing = 12" in reality
      // So 1" on drawing = 48" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 48, 5);
      
      // Verify: 64 pixels should represent 48 inches (4 feet) in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(48, 5);
    });

    it('1/2" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '1/2" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 1/2" on drawing = 12" in reality
      // So 1" on drawing = 24" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 24, 5);
      
      // Verify: 64 pixels should represent 24 inches (2 feet) in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(24, 5);
    });

    it('3/4" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '3/4" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 3/4" on drawing = 12" in reality
      // So 1" on drawing = 16" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 16, 5);
      
      // Verify: 64 pixels should represent 16 inches in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(16, 5);
    });

    it('1" = 1\'-0" scale should work correctly', () => {
      const scale = ARCHITECTURAL_SCALES.find(s => s.displayName === '1" = 1\'-0"');
      expect(scale).toBeDefined();
      
      // At this scale: 1" on drawing = 12" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 12, 5);
      
      // Verify: 64 pixels should represent 12 inches (1 foot) in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(12, 5);
    });
  });

  describe('Engineering Scales', () => {
    it('should have 6 engineering scales', () => {
      expect(ENGINEERING_SCALES).toHaveLength(6);
    });

    it('1" = 10\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 10\'');
      expect(scale).toBeDefined();
      
      // At this scale: 1" on drawing = 120" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 120, 5);
      
      // Verify: 64 pixels should represent 120 inches (10 feet) in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(120, 5);
    });

    it('1" = 20\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 20\'');
      expect(scale).toBeDefined();
      
      // At this scale: 1" on drawing = 240" in reality
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 240, 5);
      
      // Verify: 64 pixels should represent 240 inches (20 feet) in reality
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(240, 5);
    });

    it('1" = 30\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 30\'');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 360, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(360, 5);
    });

    it('1" = 40\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 40\'');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 480, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(480, 5);
    });

    it('1" = 50\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 50\'');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 600, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(600, 5);
    });

    it('1" = 60\' scale should work correctly', () => {
      const scale = ENGINEERING_SCALES.find(s => s.displayName === '1" = 60\'');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 720, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(720, 5);
    });
  });

  describe('Metric Scales', () => {
    it('should have 8 metric scales', () => {
      expect(METRIC_SCALES).toHaveLength(8);
    });

    it('1:1 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:1');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBe(BASE_PIXELS_PER_INCH);
      
      // Verify: 64 pixels = 1 inch
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBe(1);
    });

    it('1:5 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:5');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 5, 5);
      
      // Verify: 64 pixels = 5 inches
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(5, 5);
    });

    it('1:10 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:10');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 10, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(10, 5);
    });

    it('1:20 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:20');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 20, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(20, 5);
    });

    it('1:50 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:50');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 50, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(50, 5);
    });

    it('1:100 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:100');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 100, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(100, 5);
    });

    it('1:200 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:200');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 200, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(200, 5);
    });

    it('1:500 scale should work correctly', () => {
      const scale = METRIC_SCALES.find(s => s.displayName === '1:500');
      expect(scale).toBeDefined();
      
      expect(scale!.pixelsPerInch).toBeCloseTo(BASE_PIXELS_PER_INCH / 500, 5);
      
      const inches = pixelsToInches(64, scale!);
      expect(inches).toBeCloseTo(500, 5);
    });
  });

  describe('All Scales', () => {
    it('should have correct type and unit for all scales', () => {
      ARCHITECTURAL_SCALES.forEach(scale => {
        expect(scale.type).toBe('architectural');
        expect(scale.unit).toBe('imperial');
      });

      ENGINEERING_SCALES.forEach(scale => {
        expect(scale.type).toBe('engineering');
        expect(scale.unit).toBe('imperial');
      });

      METRIC_SCALES.forEach(scale => {
        expect(scale.type).toBe('metric');
        expect(scale.unit).toBe('metric');
      });
    });

    it('should have unique display names', () => {
      const allScales = [...ARCHITECTURAL_SCALES, ...ENGINEERING_SCALES, ...METRIC_SCALES];
      const displayNames = allScales.map(s => s.displayName);
      const uniqueNames = new Set(displayNames);
      
      expect(uniqueNames.size).toBe(displayNames.length);
    });
  });
});

