/**
 * Scale utilities tests
 */

import { describe, it, expect } from 'vitest';
import { pixelsToInches, formatLength } from '../scale';
import type { Scale } from '../../types';

describe('Scale Utilities', () => {
  describe('pixelsToInches', () => {
    it('should convert pixels to inches with 1:1 scale', () => {
      const scale: Scale = {
        type: 'custom',
        pixelsPerInch: 1,
        displayName: '1:1',
        unit: 'imperial'
      };
      expect(pixelsToInches(100, scale)).toBe(100);
    });

    it('should convert pixels to inches with architectural scale', () => {
      // 1/4" = 1'-0" means 48 pixels per inch (1 pixel = 1/48 inch)
      const scale: Scale = {
        type: 'architectural',
        pixelsPerInch: 48,
        displayName: '1/4" = 1\'-0"',
        unit: 'imperial'
      };
      expect(pixelsToInches(48, scale)).toBe(1);
    });

    it('should handle fractional results', () => {
      const scale: Scale = {
        type: 'custom',
        pixelsPerInch: 2,
        displayName: '2:1',
        unit: 'imperial'
      };
      expect(pixelsToInches(100, scale)).toBe(50);
    });
  });

  describe('formatLength - Imperial', () => {
    it('should format inches only when less than 1 foot', () => {
      expect(formatLength(6, 'imperial')).toBe('6"');
    });

    it('should format feet and inches', () => {
      expect(formatLength(66, 'imperial')).toBe('5\'-6"');
    });

    it('should format feet with 0 inches', () => {
      expect(formatLength(60, 'imperial')).toBe('5\'-0"');
    });

    it('should round to 1 decimal place', () => {
      expect(formatLength(12.56, 'imperial')).toBe('1\'-0.6"');
    });

    it('should handle zero', () => {
      expect(formatLength(0, 'imperial')).toBe('0"');
    });

    it('should handle large values', () => {
      expect(formatLength(144, 'imperial')).toBe('12\'-0"');
    });
  });

  describe('formatLength - Metric', () => {
    it('should format centimeters when less than 100cm', () => {
      expect(formatLength(10, 'metric')).toBe('25.4 cm');
    });

    it('should format meters when >= 100cm', () => {
      // 40 inches = 101.6 cm > 100 cm
      expect(formatLength(40, 'metric')).toBe('1.02 m');
    });

    it('should handle zero', () => {
      expect(formatLength(0, 'metric')).toBe('0.0 cm');
    });

    it('should convert inches to cm correctly', () => {
      // 1 inch = 2.54 cm
      expect(formatLength(1, 'metric')).toBe('2.5 cm');
    });

    it('should format large values in meters', () => {
      // 100 inches = 254 cm = 2.54 m
      expect(formatLength(100, 'metric')).toBe('2.54 m');
    });
  });
});

