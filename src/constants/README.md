# Constants Directory

This directory contains all constant values and configuration used throughout the HVAC Canvas application. Constants are organized by domain to improve discoverability and maintainability.

## Organization

Constants are grouped into domain-specific files:

- **`canvas.constants.ts`** - Canvas configuration (zoom, selection, hit test)
- **`scale.constants.ts`** - Scale definitions (architectural, engineering, metric)
- **`snap.constants.ts`** - Snap thresholds and visual indicators
- **`theme.constants.ts`** - Theme tokens and colors
- **`index.ts`** - Barrel export for clean imports

## Constant Files

### canvas.constants.ts

Canvas behavior and interaction constants:

```typescript
// Zoom configuration
export const ZOOM_FACTOR = 1.2;           // 20% zoom per step
export const MIN_ZOOM = 0.1;              // 10% minimum zoom
export const MAX_ZOOM = 5.0;              // 500% maximum zoom

// Line constraints
export const MIN_LINE_LENGTH = 5;         // Minimum line length in pixels

// Selection and hit testing
export const SELECTION_HIGHLIGHT_WIDTH = 4;  // Selection outline width
export const HIT_TEST_TOLERANCE = 10;        // Click tolerance in pixels
export const HIT_TEST_LINE_TOLERANCE = 5;    // Line proximity tolerance

// Visual styling
export const LINE_COLOR = '#111827';         // Default line color (gray-900)
```

**Usage:**
```typescript
import { ZOOM_FACTOR, MIN_LINE_LENGTH } from '../constants';

const newZoom = currentZoom * ZOOM_FACTOR;
if (lineLength < MIN_LINE_LENGTH) {
  // Line too short, reject
}
```

### scale.constants.ts

Predefined measurement scales:

```typescript
// Architectural scales (imperial)
export const ARCHITECTURAL_SCALES: Scale[] = [
  {
    type: 'architectural',
    pixelsPerInch: 48,
    displayName: '1/4" = 1\'',
    unit: 'imperial'
  },
  {
    type: 'architectural',
    pixelsPerInch: 24,
    displayName: '1/8" = 1\'',
    unit: 'imperial'
  },
  // ... more scales
];

// Engineering scales (imperial)
export const ENGINEERING_SCALES: Scale[] = [
  {
    type: 'engineering',
    pixelsPerInch: 60,
    displayName: '1" = 10\'',
    unit: 'imperial'
  },
  // ... more scales
];

// Metric scales
export const METRIC_SCALES: Scale[] = [
  {
    type: 'metric',
    pixelsPerInch: 47.244,
    displayName: '1:20',
    unit: 'metric'
  },
  // ... more scales
];
```

**Available Scales:**
- **Architectural:** 1/4", 1/8", 1/16", 3/32", 3/16", 1/2", 1", 3/4"
- **Engineering:** 1"=10', 1"=20', 1"=30', 1"=40', 1"=50', 1"=60'
- **Metric:** 1:20, 1:50, 1:100, 1:200, 1:500

### snap.constants.ts

Snap detection configuration:

```typescript
// Snap thresholds (in pixels)
export const SNAP_THRESHOLD_ENDPOINT = 15;   // Endpoint snap distance
export const SNAP_THRESHOLD_MIDPOINT = 15;   // Midpoint snap distance
export const SNAP_THRESHOLD_LINE = 10;       // Line snap distance

// Snap indicator styling
export const SNAP_INDICATOR_RADIUS = 8;      // Indicator circle radius
export const SNAP_INDICATOR_COLOR = '#3b82f6'; // Blue-500
export const SNAP_INDICATOR_WIDTH = 2;       // Indicator line width
```

**Snap Priority:**
1. Endpoint (highest priority)
2. Midpoint
3. Line (lowest priority)

### theme.constants.ts

Theme tokens and color system:

```typescript
/**
 * Tech Blue theme tokens component
 * Injects CSS custom properties for consistent theming
 */
export function TechBlueTokens(): JSX.Element {
  return (
    <style>{`
      :root {
        --color-primary: #1e40af;      /* blue-800 */
        --color-primary-hover: #1e3a8a; /* blue-900 */
        --color-secondary: #3b82f6;    /* blue-500 */
        --color-accent: #60a5fa;       /* blue-400 */
        --color-background: #f9fafb;   /* gray-50 */
        --color-surface: #ffffff;      /* white */
        --color-text: #111827;         /* gray-900 */
        --color-text-secondary: #6b7280; /* gray-500 */
        --color-border: #e5e7eb;       /* gray-200 */
        --color-error: #ef4444;        /* red-500 */
        --color-success: #10b981;      /* green-500 */
      }
    `}</style>
  );
}
```

**Usage:**
```typescript
import { TechBlueTokens } from '../constants';

function App() {
  return (
    <>
      <TechBlueTokens />
      {/* Rest of app */}
    </>
  );
}
```

## Import Patterns

### Barrel Export (Recommended)

```typescript
// Import from barrel export
import { 
  ZOOM_FACTOR, 
  MIN_LINE_LENGTH, 
  ARCHITECTURAL_SCALES,
  SNAP_THRESHOLD_ENDPOINT 
} from '../constants';
```

### Direct Import (When Needed)

```typescript
// Import from specific file
import { ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM } from '../constants/canvas.constants';
import { ARCHITECTURAL_SCALES } from '../constants/scale.constants';
```

## Constant Naming Conventions

- **All constants:** SCREAMING_SNAKE_CASE (e.g., `ZOOM_FACTOR`, `MIN_LINE_LENGTH`)
- **Arrays of objects:** Plural names (e.g., `ARCHITECTURAL_SCALES`)
- **Components:** PascalCase (e.g., `TechBlueTokens`)

## Adding New Constants

When adding new constants:

1. **Choose the right file** based on domain
2. **Add JSDoc comments** explaining the constant's purpose and units
3. **Export from the file** and add to `index.ts` barrel export
4. **Use descriptive names** that explain what the constant represents
5. **Include units** in comments (pixels, seconds, etc.)

Example:
```typescript
// src/constants/canvas.constants.ts

/**
 * Maximum number of undo steps to keep in history
 */
export const MAX_UNDO_HISTORY = 50;

/**
 * Auto-save interval in milliseconds (5 minutes)
 */
export const AUTO_SAVE_INTERVAL_MS = 5 * 60 * 1000;
```

## Configuration vs. Constants

**Constants (this directory):**
- Values that don't change during runtime
- Hardcoded configuration
- Thresholds and limits
- Default values

**Not Constants (use state/props instead):**
- User preferences (should be in state)
- Runtime configuration (should be loaded from API/config file)
- Dynamic values (should be calculated)

## Magic Number Elimination

Before refactoring:
```typescript
// ❌ Magic numbers
const newZoom = currentZoom * 1.2;
if (distance < 10) { /* snap */ }
```

After refactoring:
```typescript
// ✅ Named constants
const newZoom = currentZoom * ZOOM_FACTOR;
if (distance < SNAP_THRESHOLD_LINE) { /* snap */ }
```

## Related Documentation

- **ADR-001:** Extract Types & Constants - Decision rationale
- **Types:** `src/types/` - Related type definitions
- **Architecture:** `docs/ARCHITECTURE.md` - Overall system design

## Dependencies

This directory depends only on **Types**:

```
Types
  ↓
Constants (depends on Types)
  ↑
Utils
  ↑
Services
  ↑
Hooks
  ↑
Components
```

