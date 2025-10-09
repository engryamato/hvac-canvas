# Utils Directory

This directory contains pure utility functions organized by domain. All functions are stateless, side-effect-free, and thoroughly tested.

## Organization

Utilities are grouped into domain-specific subdirectories:

- **`geometry/`** - Point and line geometric calculations
- **`canvas/`** - Canvas coordinate transformations and rendering
- **`snap/`** - Snap detection logic
- **`scale/`** - Scale conversions and formatting
- **`id.ts`** - Unique ID generation
- **`index.ts`** - Barrel export for clean imports

## Test Coverage

All utilities have comprehensive unit tests with **~95% coverage**:

```
src/utils/__tests__/
├── geometry.test.ts (13 tests)
├── canvas.test.ts (10 tests)
├── snap.test.ts (9 tests)
├── scale.test.ts (14 tests)
└── id.test.ts (5 tests)
```

## Utility Modules

### geometry/

Point and line geometric calculations:

**`points.ts`**
```typescript
/**
 * Calculate Euclidean distance between two points
 */
export function dist(a: Pt, b: Pt): number;
```

**`lines.ts`**
```typescript
/**
 * Calculate distance from point to line segment
 */
export function distancePointToSegment(pt: Pt, lineStart: Pt, lineEnd: Pt): number;

/**
 * Find closest point on line segment to given point
 */
export function getClosestPointOnSegment(pt: Pt, lineStart: Pt, lineEnd: Pt): Pt;
```

**Usage:**
```typescript
import { dist, distancePointToSegment } from '../utils/geometry';

const distance = dist({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5
const lineDistance = distancePointToSegment(
  { x: 5, y: 5 },
  { x: 0, y: 0 },
  { x: 10, y: 0 }
); // 5
```

### canvas/

Canvas coordinate transformations and rendering setup:

**`coordinates.ts`**
```typescript
/**
 * Transform screen coordinates to canvas coordinates
 */
export function screenToCanvas(screenPt: Pt, transform: ViewportTransform): Pt;

/**
 * Transform canvas coordinates to screen coordinates
 */
export function canvasToScreen(canvasPt: Pt, transform: ViewportTransform): Pt;

/**
 * Get pointer position from event
 */
export function getPointerPos(
  e: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Pt;
```

**`rendering.ts`**
```typescript
/**
 * Apply viewport transformation to canvas context
 */
export function applyViewportTransform(
  ctx: CanvasRenderingContext2D,
  transform: ViewportTransform
): void;

/**
 * Setup canvas for HiDPI displays
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null;
```

**Usage:**
```typescript
import { screenToCanvas, setupHiDPICanvas } from '../utils/canvas';

// Convert screen click to canvas coordinates
const canvasPos = screenToCanvas(
  { x: 100, y: 100 },
  { scale: 1.5, offset: { x: 50, y: 50 } }
);

// Setup HiDPI canvas
const ctx = setupHiDPICanvas(canvas, 800, 600);
```

### snap/

Snap detection logic:

**`snapDetection.ts`**
```typescript
/**
 * Find snap target near given point
 */
export function findSnapTarget(
  pt: Pt,
  lines: Line[],
  excludeLineId?: string
): SnapTarget | null;
```

**Usage:**
```typescript
import { findSnapTarget } from '../utils/snap';

const snapTarget = findSnapTarget(
  { x: 102, y: 98 },
  lines,
  'current-line-id'
);

if (snapTarget) {
  // Snap to target.point
  console.log(`Snapping to ${snapTarget.type}`);
}
```

**Snap Priority:**
1. Endpoint (within 15px)
2. Midpoint (within 15px)
3. Line (within 10px)

### scale/

Scale conversions and formatting:

**`scaleConversion.ts`**
```typescript
/**
 * Convert pixels to inches using current scale
 */
export function pixelsToInches(pixels: number, scale: Scale): number;

/**
 * Format length for display
 */
export function formatLength(inches: number, unit: ScaleUnit): string;

/**
 * Calculate line summary grouped by width
 */
export function calculateLineSummary(
  lines: Line[],
  scale: Scale
): LineSummaryRow[];
```

**Usage:**
```typescript
import { pixelsToInches, formatLength } from '../utils/scale';

const inches = pixelsToInches(480, currentScale); // 10 inches
const display = formatLength(10, 'imperial'); // "10.0\""
```

### id.ts

Unique ID generation:

```typescript
/**
 * Generate unique ID
 * Format: timestamp-random (e.g., "1699564800000-abc123")
 */
export function uid(): string;
```

**Usage:**
```typescript
import { uid } from '../utils';

const lineId = uid(); // "1699564800000-abc123"
```

## Import Patterns

### Barrel Export (Recommended)

```typescript
// Import from barrel export
import { 
  dist, 
  screenToCanvas, 
  findSnapTarget,
  pixelsToInches,
  uid 
} from '../utils';
```

### Domain-Specific Import

```typescript
// Import from specific domain
import { dist, distancePointToSegment } from '../utils/geometry';
import { screenToCanvas, canvasToScreen } from '../utils/canvas';
```

## Utility Principles

### 1. Pure Functions

All utilities are pure functions:
- No side effects
- Same input always produces same output
- No external state dependencies

```typescript
// ✅ Pure function
export function dist(a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ❌ Not pure (depends on external state)
let lastDistance = 0;
export function dist(a: Pt, b: Pt): number {
  lastDistance = Math.sqrt(...);
  return lastDistance;
}
```

### 2. Single Responsibility

Each function does one thing well:

```typescript
// ✅ Single responsibility
export function dist(a: Pt, b: Pt): number { /* ... */ }
export function distancePointToSegment(pt: Pt, start: Pt, end: Pt): number { /* ... */ }

// ❌ Multiple responsibilities
export function calculateDistances(pt: Pt, lines: Line[]): number[] { /* ... */ }
```

### 3. Immutability

Functions don't mutate inputs:

```typescript
// ✅ Immutable
export function screenToCanvas(screenPt: Pt, transform: ViewportTransform): Pt {
  return {
    x: (screenPt.x - transform.offset.x) / transform.scale,
    y: (screenPt.y - transform.offset.y) / transform.scale,
  };
}

// ❌ Mutates input
export function screenToCanvas(screenPt: Pt, transform: ViewportTransform): Pt {
  screenPt.x = (screenPt.x - transform.offset.x) / transform.scale;
  return screenPt;
}
```

## Testing Guidelines

### Test Structure

```typescript
describe('functionName', () => {
  it('should handle normal case', () => {
    expect(functionName(input)).toBe(expected);
  });
  
  it('should handle edge case', () => {
    expect(functionName(edgeInput)).toBe(edgeExpected);
  });
  
  it('should handle error case', () => {
    expect(() => functionName(invalidInput)).toThrow();
  });
});
```

### Coverage Targets

- **Line Coverage:** ≥95%
- **Branch Coverage:** ≥90%
- **Function Coverage:** 100%

## Adding New Utilities

When adding new utilities:

1. **Choose the right domain** (geometry, canvas, snap, scale, or create new)
2. **Write the function** with JSDoc comments
3. **Write comprehensive tests** before implementation (TDD)
4. **Export from domain** and add to barrel export
5. **Update this README** with usage examples

Example:
```typescript
// src/utils/geometry/polygons.ts

/**
 * Calculate area of polygon using shoelace formula
 * @param points - Array of points forming the polygon
 * @returns Area in square pixels
 */
export function polygonArea(points: Pt[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

// src/utils/__tests__/geometry.test.ts
describe('polygonArea', () => {
  it('should calculate area of square', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ];
    expect(polygonArea(square)).toBe(100);
  });
});
```

## Related Documentation

- **ADR-002:** Extract Utility Functions - Decision rationale
- **Services:** `src/services/` - Domain logic that uses utilities
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach

## Dependencies

Utilities depend only on **Types** and **Constants**:

```
Types & Constants
  ↓
Utils (pure functions)
  ↑
Services
  ↑
Hooks
  ↑
Components
```

