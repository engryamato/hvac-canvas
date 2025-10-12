/**
 * Unit Tests for Line Properties Service
 * 
 * Tests all service functions with comprehensive coverage including:
 * - Immutability verification (original objects unchanged)
 * - Validation logic (errors and warnings)
 * - Batch operations (multi-select support)
 * - Edge cases and boundary conditions
 * - Mixed value detection
 * - Aggregate statistics calculation
 * 
 * Target: 100% code coverage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeLineDefaults,
  updateLineProperties,
  validateLineProperties,
  batchUpdateLines,
  getMixedValue,
  duplicateLine,
  calculateAggregateStats,
} from '../LinePropertiesService';
import type { Line } from '../../../types/drawing.types';

describe('Line Properties Service', () => {
  // Helper to create a complete line object
  const createLine = (overrides: Partial<Line> = {}): Line => ({
    id: 'line-123',
    a: { x: 0, y: 0 },
    b: { x: 100, y: 0 },
    width: 8,
    color: '#2563eb',
    type: 'supply',
    layer: 'Default',
    material: 'Galvanized Steel',
    gauge: '26ga',
    airflow: 500,
    notes: '',
    tags: [],
    customProperties: {},
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    ...overrides,
  });

  describe('initializeLineDefaults', () => {
    it('should initialize all properties for a minimal line', () => {
      const minimalLine: Partial<Line> = {
        id: 'test-1',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
        width: 8, // Must provide width (no default in constants)
        color: '#2563eb', // Must provide color (no default in constants)
      };

      const initialized = initializeLineDefaults(minimalLine);

      expect(initialized.id).toBe('test-1');
      expect(initialized.a).toEqual({ x: 0, y: 0 });
      expect(initialized.b).toEqual({ x: 100, y: 0 });
      expect(initialized.width).toBe(8);
      expect(initialized.color).toBe('#2563eb');
      expect(initialized.type).toBe('supply'); // Default
      expect(initialized.layer).toBe('Default');
      expect(initialized.material).toBe('Galvanized Steel');
      expect(initialized.gauge).toBe('26ga');
      expect(initialized.airflow).toBe(0);
      expect(initialized.notes).toBe('');
      expect(initialized.tags).toEqual([]);
      expect(initialized.customProperties).toEqual({});
      expect(initialized.metadata).toBeDefined();
      expect(initialized.metadata.createdAt).toBeGreaterThan(0);
      expect(initialized.metadata.updatedAt).toBeGreaterThan(0);
    });

    it('should preserve existing properties when provided', () => {
      const partialLine: Partial<Line> = {
        id: 'test-2',
        a: { x: 10, y: 20 },
        b: { x: 110, y: 20 },
        width: 12,
        type: 'return',
        material: 'Stainless Steel',
        airflow: 1000,
        notes: 'Test note',
        tags: ['tag1', 'tag2'],
      };

      const initialized = initializeLineDefaults(partialLine);

      expect(initialized.width).toBe(12);
      expect(initialized.type).toBe('return');
      expect(initialized.material).toBe('Stainless Steel');
      expect(initialized.airflow).toBe(1000);
      expect(initialized.notes).toBe('Test note');
      expect(initialized.tags).toEqual(['tag1', 'tag2']);
    });

    it('should generate new ID if not provided', () => {
      const lineWithoutId: Partial<Line> = {
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
      };

      const initialized = initializeLineDefaults(lineWithoutId);

      expect(initialized.id).toBeDefined();
      expect(initialized.id.length).toBeGreaterThan(0);
    });

    it('should handle airflow of 0 correctly (not replace with default)', () => {
      const lineWithZeroAirflow: Partial<Line> = {
        id: 'test-3',
        a: { x: 0, y: 0 },
        b: { x: 100, y: 0 },
        airflow: 0,
      };

      const initialized = initializeLineDefaults(lineWithZeroAirflow);

      expect(initialized.airflow).toBe(0);
    });

    it('should set default position if not provided', () => {
      const lineWithoutPosition: Partial<Line> = {
        id: 'test-4',
      };

      const initialized = initializeLineDefaults(lineWithoutPosition);

      expect(initialized.a).toEqual({ x: 0, y: 0 });
      expect(initialized.b).toEqual({ x: 0, y: 0 });
    });
  });

  describe('updateLineProperties', () => {
    let originalLine: Line;

    beforeEach(() => {
      originalLine = createLine();
    });

    it('should update properties immutably', () => {
      const updates = { width: 10, material: 'Aluminum' as const };
      const updated = updateLineProperties(originalLine, updates);

      // Original should be unchanged
      expect(originalLine.width).toBe(8);
      expect(originalLine.material).toBe('Galvanized Steel');

      // Updated should have new values
      expect(updated.width).toBe(10);
      expect(updated.material).toBe('Aluminum');
    });

    it('should update metadata.updatedAt timestamp', () => {
      const originalTimestamp = originalLine.metadata.updatedAt;
      
      // Wait a bit to ensure timestamp changes
      vi.useFakeTimers();
      vi.advanceTimersByTime(100);
      
      const updated = updateLineProperties(originalLine, { width: 10 });
      
      expect(updated.metadata.updatedAt).toBeGreaterThan(originalTimestamp);
      
      vi.useRealTimers();
    });

    it('should preserve metadata.createdAt timestamp', () => {
      const originalCreatedAt = originalLine.metadata.createdAt;
      const updated = updateLineProperties(originalLine, { width: 10 });

      expect(updated.metadata.createdAt).toBe(originalCreatedAt);
    });

    it('should throw error for invalid updates', () => {
      expect(() => {
        updateLineProperties(originalLine, { width: -5 });
      }).toThrow('Invalid line properties');
    });

    it('should allow updating multiple properties at once', () => {
      const updates = {
        width: 12,
        type: 'return' as const,
        material: 'Stainless Steel' as const,
        airflow: 1500,
      };

      const updated = updateLineProperties(originalLine, updates);

      expect(updated.width).toBe(12);
      expect(updated.type).toBe('return');
      expect(updated.material).toBe('Stainless Steel');
      expect(updated.airflow).toBe(1500);
    });

    it('should preserve unmodified properties', () => {
      const updated = updateLineProperties(originalLine, { width: 10 });

      expect(updated.id).toBe(originalLine.id);
      expect(updated.a).toEqual(originalLine.a);
      expect(updated.b).toEqual(originalLine.b);
      expect(updated.color).toBe(originalLine.color);
      expect(updated.type).toBe(originalLine.type);
      expect(updated.layer).toBe(originalLine.layer);
    });
  });

  describe('validateLineProperties', () => {
    it('should return valid for correct properties', () => {
      const result = validateLineProperties({
        width: 8,
        airflow: 500,
        type: 'supply',
        notes: 'Valid note',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for negative width', () => {
      const result = validateLineProperties({ width: -5 });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Width must be positive');
    });

    it('should return error for zero width', () => {
      const result = validateLineProperties({ width: 0 });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Width must be positive');
    });

    it('should return warning for non-standard width', () => {
      const result = validateLineProperties({ width: 9 }); // Not in STANDARD_WIDTHS

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Width 9" is not a standard size');
    });

    it('should return error for negative airflow', () => {
      const result = validateLineProperties({ airflow: -100 });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Airflow cannot be negative');
    });

    it('should allow zero airflow', () => {
      const result = validateLineProperties({ airflow: 0 });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for notes exceeding 120 characters', () => {
      const longNotes = 'a'.repeat(121);
      const result = validateLineProperties({ notes: longNotes });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Notes cannot exceed 120 characters');
    });

    it('should allow notes up to 120 characters', () => {
      const maxNotes = 'a'.repeat(120);
      const result = validateLineProperties({ notes: maxNotes });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for invalid type', () => {
      const result = validateLineProperties({ type: 'invalid' as any });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Type must be "supply" or "return"');
    });

    it('should allow valid types', () => {
      const supplyResult = validateLineProperties({ type: 'supply' });
      const returnResult = validateLineProperties({ type: 'return' });

      expect(supplyResult.isValid).toBe(true);
      expect(returnResult.isValid).toBe(true);
    });

    it('should return multiple errors for multiple invalid properties', () => {
      const result = validateLineProperties({
        width: -5,
        airflow: -100,
        notes: 'a'.repeat(121),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle empty properties object', () => {
      const result = validateLineProperties({});

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('batchUpdateLines', () => {
    let lines: Line[];

    beforeEach(() => {
      lines = [
        createLine({ id: 'line1', width: 8 }),
        createLine({ id: 'line2', width: 10 }),
        createLine({ id: 'line3', width: 12 }),
      ];
    });

    it('should update multiple lines immutably', () => {
      const lineIds = ['line1', 'line2'];
      const updates = { material: 'Aluminum' as const };

      const updated = batchUpdateLines(lines, lineIds, updates);

      // Original array should be unchanged
      expect(lines[0].material).toBe('Galvanized Steel');
      expect(lines[1].material).toBe('Galvanized Steel');

      // Updated array should have changes
      expect(updated[0].material).toBe('Aluminum');
      expect(updated[1].material).toBe('Aluminum');
      expect(updated[2].material).toBe('Galvanized Steel'); // Not selected
    });

    it('should only update selected lines', () => {
      const lineIds = ['line1'];
      const updates = { width: 14 };

      const updated = batchUpdateLines(lines, lineIds, updates);

      expect(updated[0].width).toBe(14);
      expect(updated[1].width).toBe(10); // Unchanged
      expect(updated[2].width).toBe(12); // Unchanged
    });

    it('should update metadata.updatedAt for selected lines', () => {
      const lineIds = ['line1', 'line2'];
      const updates = { width: 14 };

      vi.useFakeTimers();
      const beforeTime = Date.now();
      vi.advanceTimersByTime(100);

      const updated = batchUpdateLines(lines, lineIds, updates);

      expect(updated[0].metadata.updatedAt).toBeGreaterThan(beforeTime);
      expect(updated[1].metadata.updatedAt).toBeGreaterThan(beforeTime);
      expect(updated[2].metadata.updatedAt).toBe(lines[2].metadata.updatedAt); // Unchanged

      vi.useRealTimers();
    });

    it('should throw error for invalid updates', () => {
      const lineIds = ['line1'];
      const invalidUpdates = { width: -5 };

      expect(() => {
        batchUpdateLines(lines, lineIds, invalidUpdates);
      }).toThrow('Invalid line properties');
    });

    it('should handle empty lineIds array', () => {
      const updated = batchUpdateLines(lines, [], { width: 14 });

      // No lines should be updated
      expect(updated[0].width).toBe(8);
      expect(updated[1].width).toBe(10);
      expect(updated[2].width).toBe(12);
    });

    it('should handle non-existent line IDs gracefully', () => {
      const lineIds = ['nonexistent'];
      const updates = { width: 14 };

      const updated = batchUpdateLines(lines, lineIds, updates);

      // No lines should be updated
      expect(updated[0].width).toBe(8);
      expect(updated[1].width).toBe(10);
      expect(updated[2].width).toBe(12);
    });

    it('should update all lines when all IDs provided', () => {
      const lineIds = ['line1', 'line2', 'line3'];
      const updates = { type: 'return' as const };

      const updated = batchUpdateLines(lines, lineIds, updates);

      expect(updated[0].type).toBe('return');
      expect(updated[1].type).toBe('return');
      expect(updated[2].type).toBe('return');
    });
  });

  describe('getMixedValue', () => {
    it('should return value when all values are the same', () => {
      const values = [8, 8, 8, 8];
      const result = getMixedValue(values);

      expect(result).toBe(8);
    });

    it('should return "mixed" when values differ', () => {
      const values = [8, 10, 12];
      const result = getMixedValue(values);

      expect(result).toBe('mixed');
    });

    it('should return "mixed" for empty array', () => {
      const result = getMixedValue([]);

      expect(result).toBe('mixed');
    });

    it('should return value for single-element array', () => {
      const result = getMixedValue([8]);

      expect(result).toBe(8);
    });

    it('should handle string values', () => {
      const sameStrings = getMixedValue(['supply', 'supply', 'supply']);
      const mixedStrings = getMixedValue(['supply', 'return']);

      expect(sameStrings).toBe('supply');
      expect(mixedStrings).toBe('mixed');
    });

    it('should handle object values with deep equality', () => {
      const obj1 = { x: 10, y: 20 };
      const obj2 = { x: 10, y: 20 };
      const obj3 = { x: 15, y: 25 };

      const sameObjects = getMixedValue([obj1, obj2]);
      const mixedObjects = getMixedValue([obj1, obj3]);

      expect(sameObjects).toEqual({ x: 10, y: 20 });
      expect(mixedObjects).toBe('mixed');
    });

    it('should handle array values with deep equality', () => {
      const arr1 = ['tag1', 'tag2'];
      const arr2 = ['tag1', 'tag2'];
      const arr3 = ['tag3'];

      const sameArrays = getMixedValue([arr1, arr2]);
      const mixedArrays = getMixedValue([arr1, arr3]);

      expect(sameArrays).toEqual(['tag1', 'tag2']);
      expect(mixedArrays).toBe('mixed');
    });

    it('should handle null values', () => {
      const sameNulls = getMixedValue([null, null]);
      const mixedNulls = getMixedValue([null, 'value']);

      expect(sameNulls).toBe(null);
      expect(mixedNulls).toBe('mixed');
    });

    it('should handle boolean values', () => {
      const sameBooleans = getMixedValue([true, true, true]);
      const mixedBooleans = getMixedValue([true, false]);

      expect(sameBooleans).toBe(true);
      expect(mixedBooleans).toBe('mixed');
    });
  });

  describe('duplicateLine', () => {
    let originalLine: Line;

    beforeEach(() => {
      originalLine = createLine({
        id: 'original',
        a: { x: 100, y: 200 },
        b: { x: 300, y: 200 },
        width: 10,
        material: 'Stainless Steel',
        notes: 'Original note',
        tags: ['tag1', 'tag2'],
      });
    });

    it('should create a new line with different ID', () => {
      const duplicate = duplicateLine(originalLine);

      expect(duplicate.id).not.toBe(originalLine.id);
      expect(duplicate.id).toBeDefined();
      expect(duplicate.id.length).toBeGreaterThan(0);
    });

    it('should offset position by default (20, 20)', () => {
      const duplicate = duplicateLine(originalLine);

      expect(duplicate.a).toEqual({ x: 120, y: 220 });
      expect(duplicate.b).toEqual({ x: 320, y: 220 });
    });

    it('should offset position by custom amount', () => {
      const duplicate = duplicateLine(originalLine, { x: 50, y: 100 });

      expect(duplicate.a).toEqual({ x: 150, y: 300 });
      expect(duplicate.b).toEqual({ x: 350, y: 300 });
    });

    it('should copy all properties except ID and position', () => {
      const duplicate = duplicateLine(originalLine);

      expect(duplicate.width).toBe(originalLine.width);
      expect(duplicate.color).toBe(originalLine.color);
      expect(duplicate.type).toBe(originalLine.type);
      expect(duplicate.layer).toBe(originalLine.layer);
      expect(duplicate.material).toBe(originalLine.material);
      expect(duplicate.gauge).toBe(originalLine.gauge);
      expect(duplicate.airflow).toBe(originalLine.airflow);
      expect(duplicate.notes).toBe(originalLine.notes);
      expect(duplicate.tags).toEqual(originalLine.tags);
      expect(duplicate.customProperties).toEqual(originalLine.customProperties);
    });

    it('should reset metadata timestamps', () => {
      vi.useFakeTimers();
      const beforeTime = Date.now();
      vi.advanceTimersByTime(100);

      const duplicate = duplicateLine(originalLine);

      expect(duplicate.metadata.createdAt).toBeGreaterThan(beforeTime);
      expect(duplicate.metadata.updatedAt).toBeGreaterThan(beforeTime);
      expect(duplicate.metadata.createdAt).toBe(duplicate.metadata.updatedAt);

      vi.useRealTimers();
    });

    it('should not modify original line', () => {
      const originalA = { ...originalLine.a };
      const originalB = { ...originalLine.b };

      duplicateLine(originalLine);

      expect(originalLine.a).toEqual(originalA);
      expect(originalLine.b).toEqual(originalB);
      expect(originalLine.id).toBe('original');
    });

    it('should handle negative offsets', () => {
      const duplicate = duplicateLine(originalLine, { x: -20, y: -20 });

      expect(duplicate.a).toEqual({ x: 80, y: 180 });
      expect(duplicate.b).toEqual({ x: 280, y: 180 });
    });

    it('should handle zero offset', () => {
      const duplicate = duplicateLine(originalLine, { x: 0, y: 0 });

      expect(duplicate.a).toEqual(originalLine.a);
      expect(duplicate.b).toEqual(originalLine.b);
      expect(duplicate.id).not.toBe(originalLine.id); // Still different ID
    });
  });

  describe('calculateAggregateStats', () => {
    let lines: Line[];

    beforeEach(() => {
      lines = [
        createLine({
          id: 'line1',
          a: { x: 0, y: 0 },
          b: { x: 100, y: 0 }, // Length: 100
          type: 'supply',
          width: 8,
          material: 'Galvanized Steel',
          gauge: '26ga',
          layer: 'Default',
        }),
        createLine({
          id: 'line2',
          a: { x: 0, y: 0 },
          b: { x: 0, y: 50 }, // Length: 50
          type: 'supply',
          width: 8,
          material: 'Galvanized Steel',
          gauge: '26ga',
          layer: 'Default',
        }),
        createLine({
          id: 'line3',
          a: { x: 0, y: 0 },
          b: { x: 30, y: 40 }, // Length: 50 (3-4-5 triangle)
          type: 'return',
          width: 10,
          material: 'Aluminum',
          gauge: '24ga',
          layer: 'Layer2',
        }),
      ];
    });

    it('should calculate count correctly', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'line2']);

      expect(stats.count).toBe(2);
    });

    it('should calculate total length correctly', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'line2']);

      expect(stats.totalLength).toBe(150); // 100 + 50
    });

    it('should detect same values correctly', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'line2']);

      expect(stats.mixedValues.type).toBe('supply');
      expect(stats.mixedValues.width).toBe(8);
      expect(stats.mixedValues.material).toBe('Galvanized Steel');
      expect(stats.mixedValues.gauge).toBe('26ga');
      expect(stats.mixedValues.layer).toBe('Default');
    });

    it('should detect mixed values correctly', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'line3']);

      expect(stats.mixedValues.type).toBe('mixed');
      expect(stats.mixedValues.width).toBe('mixed');
      expect(stats.mixedValues.material).toBe('mixed');
      expect(stats.mixedValues.gauge).toBe('mixed');
      expect(stats.mixedValues.layer).toBe('mixed');
    });

    it('should handle empty selection', () => {
      const stats = calculateAggregateStats(lines, []);

      expect(stats.count).toBe(0);
      expect(stats.totalLength).toBe(0);
      expect(stats.mixedValues).toEqual({});
    });

    it('should handle single line selection', () => {
      const stats = calculateAggregateStats(lines, ['line1']);

      expect(stats.count).toBe(1);
      expect(stats.totalLength).toBe(100);
      expect(stats.mixedValues.type).toBe('supply');
      expect(stats.mixedValues.width).toBe(8);
    });

    it('should handle all lines selected', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'line2', 'line3']);

      expect(stats.count).toBe(3);
      expect(stats.totalLength).toBe(200); // 100 + 50 + 50
    });

    it('should ignore non-existent line IDs', () => {
      const stats = calculateAggregateStats(lines, ['line1', 'nonexistent']);

      expect(stats.count).toBe(1);
      expect(stats.totalLength).toBe(100);
    });

    it('should handle diagonal lines correctly', () => {
      const stats = calculateAggregateStats(lines, ['line3']);

      expect(stats.totalLength).toBe(50); // 3-4-5 triangle
    });
  });
});
