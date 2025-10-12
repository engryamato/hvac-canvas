/**
 * Line Properties Service
 * 
 * This service provides business logic for managing line properties including
 * CRUD operations, validation, batch updates, and multi-select support.
 * 
 * All functions are pure and return new objects (immutable updates).
 */

import type { Line } from '../../types/drawing.types';
import type { ValidationResult, AggregateStats } from '../../types/modal.types';
import { DEFAULT_DUCT_PROPERTIES } from '../../constants/duct.constants';
import { STANDARD_WIDTHS } from '../../constants/duct.constants';
import { uid } from '../../utils/id';
import { getLineLength } from '../../utils/geometry';

/**
 * Initialize default duct properties for a line
 * 
 * For existing lines without new duct properties, this function sets sensible
 * defaults from DEFAULT_DUCT_PROPERTIES constant. For new lines, it initializes
 * all required properties.
 * 
 * @param line - Line to initialize (may have partial properties)
 * @returns New line object with all properties initialized
 * 
 * @example
 * ```typescript
 * const oldLine = { id: '123', a: {x: 0, y: 0}, b: {x: 100, y: 0}, width: 8, color: '#000' };
 * const initialized = initializeLineDefaults(oldLine);
 * // Returns: { ...oldLine, type: 'supply', layer: 'Default', material: 'Galvanized Steel', ... }
 * ```
 */
export function initializeLineDefaults(line: Partial<Line>): Line {
  const now = Date.now();
  
  return {
    // Core properties (required)
    id: line.id || uid(),
    a: line.a || { x: 0, y: 0 },
    b: line.b || { x: 0, y: 0 },
    width: line.width || DEFAULT_DUCT_PROPERTIES.width,
    color: line.color || DEFAULT_DUCT_PROPERTIES.color,
    
    // Duct properties (use defaults if not provided)
    type: line.type || DEFAULT_DUCT_PROPERTIES.type,
    layer: line.layer || DEFAULT_DUCT_PROPERTIES.layer,
    material: line.material || DEFAULT_DUCT_PROPERTIES.material,
    gauge: line.gauge || DEFAULT_DUCT_PROPERTIES.gauge,
    airflow: line.airflow ?? DEFAULT_DUCT_PROPERTIES.airflow,
    
    // Metadata properties
    notes: line.notes || DEFAULT_DUCT_PROPERTIES.notes,
    tags: line.tags || DEFAULT_DUCT_PROPERTIES.tags,
    customProperties: line.customProperties || DEFAULT_DUCT_PROPERTIES.customProperties,
    metadata: line.metadata || {
      createdAt: now,
      updatedAt: now,
    },
  };
}

/**
 * Update line properties immutably
 * 
 * Creates a new line object with updated properties. Automatically updates
 * the metadata.updatedAt timestamp. Validates updates before applying.
 * 
 * @param line - Original line to update
 * @param updates - Partial line properties to update
 * @returns New line object with updates applied
 * 
 * @example
 * ```typescript
 * const updated = updateLineProperties(line, { width: 10, material: 'Stainless Steel' });
 * // Returns: { ...line, width: 10, material: 'Stainless Steel', metadata: { ...metadata, updatedAt: now } }
 * ```
 * 
 * @throws {Error} If validation fails
 */
export function updateLineProperties(line: Line, updates: Partial<Line>): Line {
  // Validate updates before applying
  const validation = validateLineProperties(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid line properties: ${validation.errors.join(', ')}`);
  }

  return {
    ...line,
    ...updates,
    metadata: {
      ...line.metadata,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Validate line properties
 * 
 * Checks if property values are valid according to business rules:
 * - Width must be positive and ideally a standard size
 * - Airflow must be non-negative
 * - Notes must not exceed max length
 * - Type, material, gauge must be valid enum values
 * 
 * @param properties - Partial line properties to validate
 * @returns Validation result with errors and warnings
 * 
 * @example
 * ```typescript
 * const result = validateLineProperties({ width: -5, airflow: 500 });
 * // Returns: { isValid: false, errors: ['Width must be positive'], warnings: [] }
 * ```
 */
export function validateLineProperties(properties: Partial<Line>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate width
  if (properties.width !== undefined) {
    if (properties.width <= 0) {
      errors.push('Width must be positive');
    } else if (!STANDARD_WIDTHS.includes(properties.width)) {
      warnings.push(`Width ${properties.width}" is not a standard size`);
    }
  }

  // Validate airflow
  if (properties.airflow !== undefined && properties.airflow < 0) {
    errors.push('Airflow cannot be negative');
  }

  // Validate notes length
  if (properties.notes !== undefined && properties.notes.length > 120) {
    errors.push('Notes cannot exceed 120 characters');
  }

  // Validate type
  if (properties.type !== undefined) {
    if (properties.type !== 'supply' && properties.type !== 'return') {
      errors.push('Type must be "supply" or "return"');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Batch update multiple lines
 * 
 * Applies the same updates to multiple lines immutably. Useful for multi-select
 * operations where the user wants to change a property across multiple lines.
 * 
 * @param lines - All lines in the drawing
 * @param lineIds - IDs of lines to update
 * @param updates - Properties to update on selected lines
 * @returns New lines array with updates applied to selected lines
 * 
 * @example
 * ```typescript
 * const updated = batchUpdateLines(allLines, ['line1', 'line2'], { material: 'Aluminum' });
 * // Returns: new array with line1 and line2 having material='Aluminum'
 * ```
 * 
 * @throws {Error} If validation fails for any update
 */
export function batchUpdateLines(
  lines: Line[],
  lineIds: string[],
  updates: Partial<Line>
): Line[] {
  // Validate updates once before applying to all lines
  const validation = validateLineProperties(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid line properties: ${validation.errors.join(', ')}`);
  }

  const lineIdSet = new Set(lineIds);
  const now = Date.now();

  return lines.map((line) => {
    if (!lineIdSet.has(line.id)) {
      return line; // Not selected, return unchanged
    }

    return {
      ...line,
      ...updates,
      metadata: {
        ...line.metadata,
        updatedAt: now,
      },
    };
  });
}

/**
 * Get mixed value for multi-select
 * 
 * Helper function to determine if a property has the same value across all
 * selected lines. Returns the value if all match, or 'mixed' if they differ.
 * 
 * @param values - Array of values from selected lines
 * @returns The common value, or 'mixed' if values differ
 * 
 * @example
 * ```typescript
 * getMixedValue([8, 8, 8]); // Returns: 8
 * getMixedValue([8, 10, 12]); // Returns: 'mixed'
 * getMixedValue([]); // Returns: 'mixed'
 * ```
 */
export function getMixedValue<T>(values: T[]): T | 'mixed' {
  if (values.length === 0) {
    return 'mixed';
  }

  const firstValue = values[0];
  const allSame = values.every((value) => {
    // Deep equality check for objects/arrays
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value) === JSON.stringify(firstValue);
    }
    return value === firstValue;
  });

  return allSame ? firstValue : 'mixed';
}

/**
 * Duplicate a line
 * 
 * Creates a copy of a line with a new ID and optionally offset position.
 * All properties are copied including metadata, but createdAt/updatedAt are reset.
 * 
 * @param line - Line to duplicate
 * @param offset - Optional offset for the duplicated line position (default: {x: 20, y: 20})
 * @returns New line object (duplicate)
 * 
 * @example
 * ```typescript
 * const duplicate = duplicateLine(originalLine, { x: 20, y: 20 });
 * // Returns: { ...originalLine, id: 'new-id', a: {x: a.x+20, y: a.y+20}, b: {x: b.x+20, y: b.y+20} }
 * ```
 */
export function duplicateLine(
  line: Line,
  offset: { x: number; y: number } = { x: 20, y: 20 }
): Line {
  const now = Date.now();

  return {
    ...line,
    id: uid(),
    a: {
      x: line.a.x + offset.x,
      y: line.a.y + offset.y,
    },
    b: {
      x: line.b.x + offset.x,
      y: line.b.y + offset.y,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };
}

/**
 * Calculate aggregate statistics for selected lines
 * 
 * Computes summary statistics for multi-select mode including total length,
 * line count, and mixed value detection for common properties.
 * 
 * @param lines - All lines in the drawing
 * @param lineIds - IDs of selected lines
 * @returns Aggregate statistics object
 * 
 * @example
 * ```typescript
 * const stats = calculateAggregateStats(allLines, ['line1', 'line2', 'line3']);
 * // Returns: {
 * //   count: 3,
 * //   totalLength: 14.7,
 * //   mixedValues: {
 * //     type: 'supply',      // All same
 * //     width: 'mixed',      // Different values
 * //     material: 'mixed'
 * //   }
 * // }
 * ```
 */
export function calculateAggregateStats(
  lines: Line[],
  lineIds: string[]
): AggregateStats {
  const selectedLines = lines.filter((line) => lineIds.includes(line.id));

  if (selectedLines.length === 0) {
    return {
      count: 0,
      totalLength: 0,
      mixedValues: {},
    };
  }

  // Calculate total length
  const totalLength = selectedLines.reduce((sum, line) => {
    return sum + getLineLength(line);
  }, 0);

  // Detect mixed values for common properties
  const types = selectedLines.map((line) => line.type);
  const widths = selectedLines.map((line) => line.width);
  const materials = selectedLines.map((line) => line.material);
  const gauges = selectedLines.map((line) => line.gauge);
  const layers = selectedLines.map((line) => line.layer);

  return {
    count: selectedLines.length,
    totalLength,
    mixedValues: {
      type: getMixedValue(types),
      width: getMixedValue(widths),
      material: getMixedValue(materials),
      gauge: getMixedValue(gauges),
      layer: getMixedValue(layers),
    },
  };
}

