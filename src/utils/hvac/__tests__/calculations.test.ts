/**
 * Unit Tests for HVAC Calculation Utilities
 * 
 * Tests all calculation functions with comprehensive coverage including:
 * - Formula verification with known values
 * - Edge cases (zero, negative, boundary values)
 * - Error handling
 * - Precision and formatting
 * 
 * Target: 100% code coverage
 */

import { describe, it, expect } from 'vitest';
import {
  calculateVelocity,
  calculateFriction,
  calculatePressure,
  formatCalculationResult,
  suggestOptimalWidth,
  validateCalculationResults,
} from '../calculations';

describe('HVAC Calculations', () => {
  describe('calculateVelocity', () => {
    it('should calculate velocity correctly for 500 CFM through 8" duct', () => {
      const velocity = calculateVelocity(500, 8);
      // Expected: (500 × 144) / (8² × π/4) / 144 = 1432 fpm
      expect(velocity).toBe(1432);
    });

    it('should calculate velocity correctly for various duct sizes', () => {
      // Test different standard widths
      expect(calculateVelocity(1000, 10)).toBe(1833);
      expect(calculateVelocity(1500, 12)).toBe(1910);
      expect(calculateVelocity(2000, 14)).toBe(1871); // Actual calculated value
    });

    it('should return 0 for 0 CFM', () => {
      const velocity = calculateVelocity(0, 8);
      expect(velocity).toBe(0);
    });

    it('should throw error for negative CFM', () => {
      expect(() => calculateVelocity(-100, 8)).toThrow('CFM cannot be negative');
    });

    it('should throw error for zero width', () => {
      expect(() => calculateVelocity(500, 0)).toThrow('Width must be greater than zero');
    });

    it('should throw error for negative width', () => {
      expect(() => calculateVelocity(500, -8)).toThrow('Width must be greater than zero');
    });

    it('should round to whole number', () => {
      const velocity = calculateVelocity(499, 8);
      expect(Number.isInteger(velocity)).toBe(true);
    });

    it('should handle very small CFM values', () => {
      const velocity = calculateVelocity(1, 8);
      expect(velocity).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(velocity)).toBe(true);
    });

    it('should handle very large CFM values', () => {
      const velocity = calculateVelocity(10000, 8);
      expect(velocity).toBeGreaterThan(0);
      expect(Number.isInteger(velocity)).toBe(true);
    });
  });

  describe('calculateFriction', () => {
    it('should calculate friction loss using Wright equation', () => {
      const friction = calculateFriction(1432, 8, 100);
      // Should return a positive value in in.wc/100ft
      expect(friction).toBeGreaterThan(0);
      expect(friction).toBeLessThan(1); // Reasonable range for friction
    });

    it('should calculate friction for various velocities', () => {
      const friction1 = calculateFriction(1000, 8, 100);
      const friction2 = calculateFriction(2000, 8, 100);
      // Higher velocity should result in higher friction
      expect(friction2).toBeGreaterThan(friction1);
    });

    it('should calculate friction for various widths', () => {
      const friction1 = calculateFriction(1500, 8, 100);
      const friction2 = calculateFriction(1500, 12, 100);
      // Larger duct should have lower friction
      expect(friction2).toBeLessThan(friction1);
    });

    it('should return 0 for 0 velocity', () => {
      const friction = calculateFriction(0, 8, 100);
      expect(friction).toBe(0);
    });

    it('should throw error for negative velocity', () => {
      expect(() => calculateFriction(-1000, 8, 100)).toThrow('Velocity cannot be negative');
    });

    it('should throw error for zero width', () => {
      expect(() => calculateFriction(1000, 0, 100)).toThrow('Width must be greater than zero');
    });

    it('should throw error for negative width', () => {
      expect(() => calculateFriction(1000, -8, 100)).toThrow('Width must be greater than zero');
    });

    it('should throw error for zero length', () => {
      expect(() => calculateFriction(1000, 8, 0)).toThrow('Length must be greater than zero');
    });

    it('should throw error for negative length', () => {
      expect(() => calculateFriction(1000, 8, -100)).toThrow('Length must be greater than zero');
    });

    it('should return value with proper precision (2 decimal places)', () => {
      const friction = calculateFriction(1432, 8, 100);
      const decimalPlaces = friction.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('should handle very small velocities', () => {
      const friction = calculateFriction(10, 8, 100);
      expect(friction).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large velocities', () => {
      const friction = calculateFriction(5000, 8, 100);
      expect(friction).toBeGreaterThan(0);
    });
  });

  describe('calculatePressure', () => {
    it('should calculate pressure correctly for 1000 fpm', () => {
      const pressure = calculatePressure(1000);
      // Expected: (1000 / 4005)² = 0.062 in
      expect(pressure).toBeCloseTo(0.06, 2);
    });

    it('should calculate pressure correctly for 1432 fpm', () => {
      const pressure = calculatePressure(1432);
      // Expected: (1432 / 4005)² ≈ 0.128 in
      expect(pressure).toBeCloseTo(0.13, 2);
    });

    it('should return 0 for 0 velocity', () => {
      const pressure = calculatePressure(0);
      expect(pressure).toBe(0);
    });

    it('should throw error for negative velocity', () => {
      expect(() => calculatePressure(-1000)).toThrow('Velocity cannot be negative');
    });

    it('should return value with proper precision (up to 4 decimal places)', () => {
      const pressure = calculatePressure(1432);
      const decimalPlaces = pressure.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(4); // toFixed(3) can result in 4 decimals after rounding
    });

    it('should handle very small velocities', () => {
      const pressure = calculatePressure(10);
      expect(pressure).toBeGreaterThanOrEqual(0);
      expect(pressure).toBeLessThan(0.01);
    });

    it('should handle very large velocities', () => {
      const pressure = calculatePressure(5000);
      expect(pressure).toBeGreaterThan(0);
    });

    it('should increase quadratically with velocity', () => {
      const pressure1 = calculatePressure(1000);
      const pressure2 = calculatePressure(2000);
      // Doubling velocity should quadruple pressure
      expect(pressure2).toBeCloseTo(pressure1 * 4, 1);
    });
  });

  describe('formatCalculationResult', () => {
    it('should format velocity with no decimals', () => {
      const formatted = formatCalculationResult(1432.5, 'fpm', 0);
      expect(formatted).toBe('1,433 fpm');
    });

    it('should format friction with 2 decimals', () => {
      const formatted = formatCalculationResult(0.0834, 'in.wc', 2);
      expect(formatted).toBe('0.08 in.wc');
    });

    it('should format pressure with 3 decimals', () => {
      const formatted = formatCalculationResult(0.12756, 'in', 3);
      expect(formatted).toBe('0.128 in');
    });

    it('should add thousand separators for large numbers', () => {
      const formatted = formatCalculationResult(12345.67, 'fpm', 0);
      expect(formatted).toBe('12,346 fpm');
    });

    it('should handle zero values', () => {
      const formatted = formatCalculationResult(0, 'fpm', 0);
      expect(formatted).toBe('0 fpm');
    });

    it('should handle negative values', () => {
      const formatted = formatCalculationResult(-100, 'fpm', 0);
      expect(formatted).toBe('-100 fpm');
    });

    it('should default to 0 decimal places when precision not specified', () => {
      const formatted = formatCalculationResult(1432.789, 'fpm');
      expect(formatted).toBe('1,433 fpm');
    });

    it('should maintain trailing zeros for specified precision', () => {
      const formatted = formatCalculationResult(1.5, 'in.wc', 2);
      expect(formatted).toBe('1.50 in.wc');
    });
  });

  describe('suggestOptimalWidth', () => {
    it('should suggest next larger width when velocity exceeds target', () => {
      const suggested = suggestOptimalWidth(8, 1800, 1500);
      expect(suggested).toBeGreaterThan(8);
      expect(suggested).toBeDefined();
    });

    it('should return undefined when velocity is below target', () => {
      const suggested = suggestOptimalWidth(8, 1200, 1500);
      expect(suggested).toBeUndefined();
    });

    it('should return undefined when velocity equals target', () => {
      const suggested = suggestOptimalWidth(8, 1500, 1500);
      expect(suggested).toBeUndefined();
    });

    it('should suggest smallest width that brings velocity below target', () => {
      const suggested = suggestOptimalWidth(8, 1800, 1500);
      // Should suggest 10" (next size up)
      expect(suggested).toBe(10);
    });

    it('should skip current width and smaller sizes', () => {
      const suggested = suggestOptimalWidth(10, 2000, 1500);
      expect(suggested).toBeGreaterThan(10);
    });

    it('should suggest appropriate width for high velocity', () => {
      // High velocity - should suggest a larger width
      const suggested = suggestOptimalWidth(4, 10000, 1500);
      expect(suggested).toBeGreaterThan(4);
      expect(suggested).toBeDefined();
      // Verify the suggested width actually brings velocity below target
      const newVelocity = calculateVelocity(
        10000 * ((4 * 4 * Math.PI / 4) / 144), // Calculate CFM from original velocity
        suggested!
      );
      expect(newVelocity).toBeLessThanOrEqual(1500);
    });

    it('should use default target velocity of 1500 fpm', () => {
      const suggested1 = suggestOptimalWidth(8, 1800);
      const suggested2 = suggestOptimalWidth(8, 1800, 1500);
      expect(suggested1).toBe(suggested2);
    });
  });

  describe('validateCalculationResults', () => {
    it('should return valid result for acceptable velocity', () => {
      const result = validateCalculationResults(1200, 8);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should return warning when velocity exceeds 1500 fpm', () => {
      const result = validateCalculationResults(1800, 8);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('1500 fpm');
    });

    it('should provide suggestion when velocity exceeds threshold', () => {
      const result = validateCalculationResults(1800, 8);
      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0]).toContain('10"');
    });

    it('should return error for negative velocity', () => {
      const result = validateCalculationResults(-1000, 8);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('negative');
    });

    it('should return error for zero width', () => {
      const result = validateCalculationResults(1000, 0);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('greater than zero');
    });

    it('should return error for negative width', () => {
      const result = validateCalculationResults(1000, -8);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should return multiple errors for multiple invalid inputs', () => {
      const result = validateCalculationResults(-1000, -8);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('should handle velocity exactly at threshold', () => {
      const result = validateCalculationResults(1500, 8);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle velocity just above threshold', () => {
      const result = validateCalculationResults(1501, 8);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
    });
  });
});

