# Types Directory

This directory contains all TypeScript type definitions and interfaces used throughout the HVAC Canvas application. Types are organized by domain for better discoverability and maintainability.

## Organization

Types are grouped into domain-specific files:

- **`canvas.types.ts`** - Canvas and drawing primitives
- **`drawing.types.ts`** - Drawing state and phases
- **`scale.types.ts`** - Measurement scales and units
- **`snap.types.ts`** - Snap detection types
- **`index.ts`** - Barrel export for clean imports

## Type Files

### canvas.types.ts

Core canvas and geometric types:

```typescript
// Point in 2D space
export interface Pt {
  x: number;
  y: number;
}

// Viewport transformation state
export interface ViewportTransform {
  scale: number;    // Zoom level (1.0 = 100%)
  offset: Pt;       // Pan offset in pixels
}

// Line segment
export interface Line {
  id: string;       // Unique identifier
  start: Pt;        // Start point
  end: Pt;          // End point
  width: number;    // Line width in pixels
  color: string;    // Line color (hex)
}
```

**Usage:**
```typescript
import { Pt, Line, ViewportTransform } from '../types';

const point: Pt = { x: 100, y: 200 };
const line: Line = {
  id: 'line-1',
  start: { x: 0, y: 0 },
  end: { x: 100, y: 100 },
  width: 8,
  color: '#111827'
};
```

### drawing.types.ts

Drawing interaction state types:

```typescript
// Drawing phase state machine
export type DrawingPhase = 
  | 'idle'              // No active drawing
  | 'waiting-for-end'   // First point placed, waiting for second
  | 'selected';         // Line selected for editing
```

**State Transitions:**
```
idle → waiting-for-end (user clicks to start drawing)
waiting-for-end → idle (user completes or cancels drawing)
idle → selected (user selects a line)
selected → idle (user deselects or deletes line)
```

### scale.types.ts

Measurement scale and unit types:

```typescript
// Scale unit system
export type ScaleUnit = 'imperial' | 'metric';

// Scale type category
export type ScaleType = 'architectural' | 'engineering' | 'metric';

// Scale definition
export interface Scale {
  type: ScaleType;
  pixelsPerInch: number;
  displayName: string;
  unit: ScaleUnit;
}

// Line summary row for sidebar
export interface LineSummaryRow {
  width: number;
  widthDisplay: string;
  count: number;
  totalLength: number;
  totalLengthDisplay: string;
  lineIds: string[];
}
```

**Example Scales:**
```typescript
const architecturalScale: Scale = {
  type: 'architectural',
  pixelsPerInch: 48,
  displayName: '1/4" = 1\'',
  unit: 'imperial'
};
```

### snap.types.ts

Snap detection types:

```typescript
// Type of snap point
export type SnapType = 
  | 'endpoint'    // Snap to line endpoint
  | 'midpoint'    // Snap to line midpoint
  | 'line';       // Snap to any point on line

// Snap target information
export interface SnapTarget {
  type: SnapType;
  point: Pt;
  lineId: string;
}
```

**Usage:**
```typescript
const snapTarget: SnapTarget = {
  type: 'endpoint',
  point: { x: 100, y: 100 },
  lineId: 'line-1'
};
```

## Import Patterns

### Barrel Export (Recommended)

```typescript
// Import from barrel export
import { Pt, Line, DrawingPhase, Scale } from '../types';
```

### Direct Import (When Needed)

```typescript
// Import from specific file
import { Pt, Line } from '../types/canvas.types';
import { DrawingPhase } from '../types/drawing.types';
```

## Type Naming Conventions

- **Interfaces:** PascalCase (e.g., `Pt`, `Line`, `ViewportTransform`)
- **Type Aliases:** PascalCase (e.g., `DrawingPhase`, `SnapType`)
- **Enums:** Avoided in favor of string literal unions for better type inference

## Adding New Types

When adding new types:

1. **Choose the right file** based on domain (canvas, drawing, scale, snap)
2. **Add JSDoc comments** explaining the type's purpose
3. **Export from the file** and add to `index.ts` barrel export
4. **Update this README** if adding a new type file

Example:
```typescript
// src/types/canvas.types.ts

/**
 * Rectangle defined by top-left corner and dimensions
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

## Type Safety Best Practices

1. **Use interfaces for objects** - Better for extension and declaration merging
2. **Use type aliases for unions** - Clearer for discriminated unions
3. **Avoid `any`** - Use `unknown` if type is truly unknown
4. **Use strict null checks** - Explicitly handle `null` and `undefined`
5. **Prefer readonly** - Use `readonly` for immutable data

## Related Documentation

- **ADR-001:** Extract Types & Constants - Decision rationale
- **Constants:** `src/constants/` - Related constant values
- **Architecture:** `docs/ARCHITECTURE.md` - Overall system design

## Dependencies

This directory has **no dependencies** on other source directories. Types are the foundation of the dependency hierarchy:

```
Types (no dependencies)
  ↑
Constants
  ↑
Utils
  ↑
Services
  ↑
Hooks
  ↑
Components
```

