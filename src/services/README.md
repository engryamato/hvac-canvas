# Services Directory

This directory contains the service layer that encapsulates domain logic and provides clean interfaces between hooks and utilities. Services are stateless and orchestrate complex operations.

## Organization

Services are grouped into domain-specific subdirectories:

- **`drawing/`** - Line creation, validation, and management
- **`viewport/`** - Viewport transformations (zoom, pan)
- **`index.ts`** - Barrel export for clean imports

## Test Coverage

All services have comprehensive unit tests with **~100% coverage**:

```
src/services/__tests__/
├── DrawingService.test.ts (13 tests)
├── LineManager.test.ts (18 tests)
└── ViewportService.test.ts (19 tests)
```

## Service Modules

### drawing/

Line creation, validation, and collection management:

**`DrawingService.ts`**
```typescript
/**
 * Create a new line with validation
 * @param start - Start point
 * @param end - End point
 * @param width - Line width in pixels
 * @returns New line or null if invalid (too short)
 */
export function createLine(start: Pt, end: Pt, width: number): Line | null;

/**
 * Validate if a line meets minimum length requirement
 * @param start - Start point
 * @param end - End point
 * @returns True if line is valid
 */
export function validateLine(start: Pt, end: Pt): boolean;

/**
 * Calculate line length in pixels
 * @param start - Start point
 * @param end - End point
 * @returns Length in pixels
 */
export function calculateLineLength(start: Pt, end: Pt): number;
```

**`LineManager.ts`**
```typescript
/**
 * Add a line to the collection
 * @param lines - Current lines array
 * @param line - Line to add
 * @returns New lines array (immutable)
 */
export function addLine(lines: Line[], line: Line): Line[];

/**
 * Remove a line by ID
 * @param lines - Current lines array
 * @param id - Line ID to remove
 * @returns New lines array without the line
 */
export function removeLine(lines: Line[], id: string): Line[];

/**
 * Update line width
 * @param lines - Current lines array
 * @param id - Line ID to update
 * @param newWidth - New width value
 * @returns New lines array with updated line
 */
export function updateLineWidth(lines: Line[], id: string, newWidth: number): Line[];

/**
 * Find line by ID
 * @param lines - Lines array
 * @param id - Line ID to find
 * @returns Line or undefined if not found
 */
export function findLineById(lines: Line[], id: string): Line | undefined;
```

**Usage:**
```typescript
import { createLine, addLine, updateLineWidth } from '../services/drawing';

// Create a new line
const newLine = createLine(
  { x: 0, y: 0 },
  { x: 100, y: 100 },
  8
);

if (newLine) {
  // Add to collection (immutable)
  const updatedLines = addLine(lines, newLine);
  
  // Update width (immutable)
  const linesWithNewWidth = updateLineWidth(updatedLines, newLine.id, 12);
}
```

### viewport/

Viewport transformation calculations:

**`ViewportService.ts`**
```typescript
/**
 * Calculate new zoom level
 * @param currentZoom - Current zoom level
 * @param direction - Zoom direction ('in' or 'out')
 * @returns New zoom level clamped to min/max
 */
export function calculateZoom(
  currentZoom: number,
  direction: 'in' | 'out'
): number;

/**
 * Calculate pan offset for zoom toward point
 * @param currentOffset - Current pan offset
 * @param zoomCenter - Point to zoom toward
 * @param oldZoom - Previous zoom level
 * @param newZoom - New zoom level
 * @returns New pan offset
 */
export function calculatePanOffset(
  currentOffset: Pt,
  zoomCenter: Pt,
  oldZoom: number,
  newZoom: number
): Pt;

/**
 * Transform point using viewport transformation
 * @param point - Point to transform
 * @param transform - Viewport transformation
 * @returns Transformed point
 */
export function transformPoint(point: Pt, transform: ViewportTransform): Pt;
```

**Usage:**
```typescript
import { calculateZoom, calculatePanOffset } from '../services/viewport';

// Zoom in
const newZoom = calculateZoom(currentZoom, 'in');

// Adjust offset to zoom toward mouse position
const newOffset = calculatePanOffset(
  currentOffset,
  mousePosition,
  currentZoom,
  newZoom
);
```

## Service Principles

### 1. Stateless

Services don't maintain state - they receive inputs and return outputs:

```typescript
// ✅ Stateless service
export function addLine(lines: Line[], line: Line): Line[] {
  return [...lines, line];
}

// ❌ Stateful service (don't do this)
let currentLines: Line[] = [];
export function addLine(line: Line): void {
  currentLines.push(line);
}
```

### 2. Immutable Operations

Services return new data instead of mutating inputs:

```typescript
// ✅ Immutable
export function updateLineWidth(lines: Line[], id: string, newWidth: number): Line[] {
  return lines.map(line =>
    line.id === id ? { ...line, width: newWidth } : line
  );
}

// ❌ Mutates input
export function updateLineWidth(lines: Line[], id: string, newWidth: number): Line[] {
  const line = lines.find(l => l.id === id);
  if (line) line.width = newWidth;
  return lines;
}
```

### 3. Clear Interfaces

Services have well-defined input/output contracts:

```typescript
// ✅ Clear interface
export function createLine(
  start: Pt,
  end: Pt,
  width: number
): Line | null;

// ❌ Unclear interface
export function createLine(
  ...args: any[]
): any;
```

### 4. Utility Composition

Services compose utilities for complex operations:

```typescript
// ✅ Composes utilities
export function createLine(start: Pt, end: Pt, width: number): Line | null {
  const length = dist(start, end); // Uses geometry utility
  if (length < MIN_LINE_LENGTH) return null;
  
  return {
    id: uid(), // Uses id utility
    start,
    end,
    width,
    color: LINE_COLOR,
  };
}
```

## Service vs. Utility

**When to use Services:**
- Multi-step operations
- Domain logic orchestration
- Data validation and transformation
- Operations that combine multiple utilities

**When to use Utilities:**
- Single-purpose calculations
- Pure mathematical operations
- Coordinate transformations
- Simple data formatting

Example:
```typescript
// Utility: Simple calculation
export function dist(a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Service: Domain logic using utility
export function createLine(start: Pt, end: Pt, width: number): Line | null {
  const length = dist(start, end); // Uses utility
  if (length < MIN_LINE_LENGTH) return null; // Domain validation
  
  return {
    id: uid(),
    start,
    end,
    width,
    color: LINE_COLOR,
  };
}
```

## Testing Guidelines

### Test Structure

```typescript
describe('ServiceFunction', () => {
  it('should handle normal case', () => {
    const result = serviceFunction(input);
    expect(result).toEqual(expected);
  });
  
  it('should handle edge case', () => {
    const result = serviceFunction(edgeInput);
    expect(result).toEqual(edgeExpected);
  });
  
  it('should validate input', () => {
    const result = serviceFunction(invalidInput);
    expect(result).toBeNull();
  });
  
  it('should not mutate input', () => {
    const input = [...originalData];
    serviceFunction(input);
    expect(input).toEqual(originalData);
  });
});
```

### Coverage Targets

- **Line Coverage:** 100%
- **Branch Coverage:** 100%
- **Function Coverage:** 100%

## Adding New Services

When adding new services:

1. **Identify the domain** (drawing, viewport, or create new)
2. **Define clear interfaces** with TypeScript types
3. **Write tests first** (TDD approach)
4. **Implement using utilities** (don't duplicate logic)
5. **Ensure immutability** (return new data, don't mutate)
6. **Add JSDoc comments** explaining purpose and usage
7. **Export from domain** and add to barrel export
8. **Update this README** with usage examples

Example:
```typescript
// src/services/drawing/SelectionService.ts

/**
 * Find line at given point using hit testing
 * @param point - Point to test
 * @param lines - Lines to search
 * @param tolerance - Hit test tolerance in pixels
 * @returns Selected line or null if none found
 */
export function selectLineAtPoint(
  point: Pt,
  lines: Line[],
  tolerance: number = HIT_TEST_TOLERANCE
): Line | null {
  for (const line of lines) {
    const distance = distancePointToSegment(point, line.start, line.end);
    if (distance <= tolerance) {
      return line;
    }
  }
  return null;
}

// src/services/__tests__/SelectionService.test.ts
describe('selectLineAtPoint', () => {
  it('should select line when point is close', () => {
    const line = createLine({ x: 0, y: 0 }, { x: 100, y: 0 }, 8);
    const result = selectLineAtPoint({ x: 50, y: 5 }, [line!]);
    expect(result).toEqual(line);
  });
  
  it('should return null when point is far', () => {
    const line = createLine({ x: 0, y: 0 }, { x: 100, y: 0 }, 8);
    const result = selectLineAtPoint({ x: 50, y: 50 }, [line!]);
    expect(result).toBeNull();
  });
});
```

## Related Documentation

- **ADR-003:** Create Service Layer - Decision rationale
- **Utils:** `src/utils/` - Utilities used by services
- **Hooks:** `src/hooks/` - Hooks that use services
- **Architecture:** `docs/ARCHITECTURE.md` - Overall system design

## Dependencies

Services depend on **Utils**, **Types**, and **Constants**:

```
Types & Constants
  ↓
Utils
  ↓
Services (domain logic)
  ↑
Hooks
  ↑
Components
```

**Dependency Rules:**
- ✅ Services can import from Utils, Types, Constants
- ❌ Services cannot import from Hooks or Components
- ✅ Services are stateless (no React hooks)

