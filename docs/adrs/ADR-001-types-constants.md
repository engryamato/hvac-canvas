# ADR-001: Extract Types & Constants

**Status:** ✅ Accepted and Implemented  
**Date:** 2025-10-09  
**Phase:** Phase 1 - Foundation

---

## Context

The original DrawingCanvas.tsx component contained 1,228 lines of code with inline type definitions and magic numbers scattered throughout. This made the code difficult to maintain, understand, and refactor. Type definitions were duplicated, and constants lacked clear documentation of their purpose and relationships.

### Problems Identified

1. **Inline Type Definitions:** Types like `Pt`, `Line`, `Scale`, and `SnapTarget` were defined inline, making them difficult to reuse across modules
2. **Magic Numbers:** Constants like zoom factors (1.2), thresholds (10px), and scale values were hardcoded without explanation
3. **Poor Discoverability:** No central location to understand the data structures and configuration values
4. **Maintenance Burden:** Changes to types or constants required searching through the entire file
5. **No Type Reusability:** Other modules couldn't import and use these types

---

## Decision

We decided to extract all type definitions and constants into dedicated modules organized by domain:

### Type Organization (`src/types/`)

- **`canvas.types.ts`** - Canvas-related types (Pt, ViewportTransform, Line)
- **`drawing.types.ts`** - Drawing state types (DrawingPhase)
- **`scale.types.ts`** - Scale and measurement types (Scale, ScaleUnit, ScaleType, LineSummaryRow)
- **`snap.types.ts`** - Snap detection types (SnapType, SnapTarget)
- **`index.ts`** - Barrel export for clean imports

### Constants Organization (`src/constants/`)

- **`canvas.constants.ts`** - Canvas configuration (zoom, selection, hit test)
- **`scale.constants.ts`** - Scale definitions (architectural, engineering, metric)
- **`snap.constants.ts`** - Snap thresholds and visual indicators
- **`theme.constants.ts`** - Theme tokens and colors (TechBlueTokens component)
- **`index.ts`** - Barrel export for clean imports

### Naming Conventions

- **Singular directory names:** `type/`, `constant/` (not `types/`, `constants/`)
- **Descriptive file names:** Domain-based organization (e.g., `canvas.types.ts`, not `types.ts`)
- **Barrel exports:** Central `index.ts` for clean import paths

---

## Consequences

### Positive

✅ **Improved Maintainability:** Types and constants are now centralized and easy to find  
✅ **Better Reusability:** Types can be imported and used across all modules  
✅ **Clear Documentation:** Constants are documented with JSDoc comments explaining their purpose  
✅ **Type Safety:** Consistent type definitions across the codebase  
✅ **Reduced File Size:** Removed 73 lines from DrawingCanvas.tsx  
✅ **Foundation for Refactoring:** Clean types enable safe extraction of utilities and services

### Negative

🟡 **Additional Files:** Created 10 new files (5 type files, 5 constant files)  
🟡 **Import Overhead:** Modules now need to import types and constants  
🟡 **Learning Curve:** Developers need to know where to find types and constants

### Neutral

- **No Runtime Impact:** Type extraction is compile-time only, no bundle size change
- **No Behavior Change:** Functionality remains identical
- **Low Risk:** Very safe refactoring with minimal chance of introducing bugs

---

## Alternatives Considered

### 1. Keep Types Inline
**Rejected:** Would perpetuate maintenance issues and prevent modular architecture

### 2. Single types.ts File
**Rejected:** Would create a large, unorganized file; domain-based organization is clearer

### 3. Co-locate Types with Implementation
**Rejected:** Would scatter types across many files; centralization improves discoverability

### 4. Use Enums Instead of String Literals
**Rejected:** String literal unions provide better type inference and are more idiomatic in TypeScript

---

## Implementation Details

### Type Extraction Example

**Before (inline):**
```typescript
type Pt = { x: number; y: number };
type Line = { id: string; start: Pt; end: Pt; width: number; color: string };
```

**After (extracted):**
```typescript
// src/types/canvas.types.ts
export interface Pt {
  x: number;
  y: number;
}

export interface Line {
  id: string;
  start: Pt;
  end: Pt;
  width: number;
  color: string;
}
```

### Constants Extraction Example

**Before (magic numbers):**
```typescript
const newZoom = currentZoom * 1.2; // What is 1.2?
if (distance < 10) { /* ... */ } // What is 10?
```

**After (named constants):**
```typescript
// src/constants/canvas.constants.ts
export const ZOOM_FACTOR = 1.2;
export const SNAP_THRESHOLD_PX = 10;

// Usage
const newZoom = currentZoom * ZOOM_FACTOR;
if (distance < SNAP_THRESHOLD_PX) { /* ... */ }
```

---

## Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| DrawingCanvas.tsx Lines | 1,228 | 1,155 | -73 (-6%) |
| Total Files | 4 | 14 | +10 |
| Type Definitions | Inline | 5 files | Centralized |
| Constants | Scattered | 5 files | Organized |

---

## Lessons Learned

1. **Start with Types:** Extracting types first provides a solid foundation for further refactoring
2. **Domain Organization:** Grouping by domain (canvas, drawing, scale, snap) is more intuitive than by kind (types, constants)
3. **Barrel Exports:** Central index.ts files make imports cleaner and easier to refactor
4. **Documentation Matters:** JSDoc comments on constants explain "why" not just "what"
5. **Low Risk, High Value:** This phase had minimal risk but provided significant value for future phases

---

## Related ADRs

- **ADR-002:** Extract Utility Functions (builds on these types)
- **ADR-003:** Create Service Layer (uses these types for interfaces)
- **ADR-004:** Extract Custom Hooks (uses these types for state)
- **ADR-005:** Extract UI Components (uses these types for props)

---

## References

- Phase 1 Summary: `docs/phases/PHASE_1_SUMMARY.md`
- Type Definitions: `src/types/`
- Constants: `src/constants/`
- Refactor Scorecard: `docs/REFACTOR_SCORECARD.md`

