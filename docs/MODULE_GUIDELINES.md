# Module Organization Guidelines

**Last Updated:** 2025-10-09  
**Version:** 1.0

---

## Overview

This document defines the module organization rules and best practices for the HVAC Canvas codebase. Following these guidelines ensures consistency, maintainability, and adherence to our 7-layer architecture.

---

## Directory Structure

```
src/
├── types/              # TypeScript type definitions (foundation layer)
├── constants/          # Configuration and static values
├── utils/              # Pure utility functions
├── services/           # Domain logic layer
├── hooks/              # Custom React hooks
├── components/         # React UI components
└── [root files]        # App.tsx, main.tsx, etc.
```

---

## Layer-Specific Guidelines

### 1. Types Layer (`src/types/`)

**Purpose:** Define all TypeScript interfaces and type aliases

**Rules:**
- ✅ Only type definitions (interfaces, types, enums)
- ✅ No implementation code
- ✅ No imports from other layers (foundation layer)
- ✅ Group related types in domain-specific files
- ✅ Use barrel exports (`index.ts`)

**File Naming:**
- Pattern: `{domain}.types.ts`
- Examples: `canvas.types.ts`, `drawing.types.ts`, `scale.types.ts`

**Example:**
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

---

### 2. Constants Layer (`src/constants/`)

**Purpose:** Define all configuration values and static data

**Rules:**
- ✅ Only constant values (no functions)
- ✅ Can import from Types layer only
- ✅ Use SCREAMING_SNAKE_CASE for constants
- ✅ Group related constants in domain-specific files
- ✅ Use barrel exports (`index.ts`)

**File Naming:**
- Pattern: `{domain}.constants.ts`
- Examples: `canvas.constants.ts`, `scale.constants.ts`

**Example:**
```typescript
// src/constants/canvas.constants.ts
export const ZOOM_FACTOR = 1.2;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5.0;
export const MIN_LINE_LENGTH = 5;
```

---

### 3. Utils Layer (`src/utils/`)

**Purpose:** Pure utility functions for calculations and transformations

**Rules:**
- ✅ Only pure functions (no side effects)
- ✅ Stateless (no external dependencies)
- ✅ Immutable (don't mutate inputs)
- ✅ Can import from Constants and Types only
- ✅ Organize in domain subdirectories
- ✅ Use barrel exports (`index.ts`)

**Directory Structure:**
```
utils/
├── geometry/           # Point and line calculations
├── canvas/             # Coordinate transformations
├── snap/               # Snap detection logic
├── scale/              # Scale conversions
├── id.ts               # Unique ID generation
└── index.ts            # Barrel export
```

**File Naming:**
- Pattern: `{function-group}.ts`
- Examples: `points.ts`, `lines.ts`, `coordinates.ts`

**Example:**
```typescript
// src/utils/geometry/points.ts
import { Pt } from '../../types';

/**
 * Calculate Euclidean distance between two points
 */
export function dist(a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

---

### 4. Services Layer (`src/services/`)

**Purpose:** Encapsulate domain logic and orchestrate utilities

**Rules:**
- ✅ Stateless functions (no React hooks)
- ✅ Immutable operations (return new data)
- ✅ Can import from Utils, Constants, Types
- ✅ Cannot import from Hooks or Components
- ✅ Organize in domain subdirectories
- ✅ Use barrel exports (`index.ts`)

**Directory Structure:**
```
services/
├── drawing/            # Line creation and management
├── viewport/           # Viewport transformations
└── index.ts            # Barrel export
```

**File Naming:**
- Pattern: `{Domain}Service.ts` or `{Domain}Manager.ts`
- Examples: `DrawingService.ts`, `LineManager.ts`

**Example:**
```typescript
// src/services/drawing/DrawingService.ts
import { Pt, Line } from '../../types';
import { MIN_LINE_LENGTH, LINE_COLOR } from '../../constants';
import { dist } from '../../utils/geometry';
import { uid } from '../../utils';

/**
 * Create a new line with validation
 */
export function createLine(start: Pt, end: Pt, width: number): Line | null {
  const length = dist(start, end);
  if (length < MIN_LINE_LENGTH) return null;
  
  return {
    id: uid(),
    start,
    end,
    width,
    color: LINE_COLOR,
  };
}
```

---

### 5. Hooks Layer (`src/hooks/`)

**Purpose:** Manage stateful logic and side effects

**Rules:**
- ✅ Can use React hooks (useState, useEffect, etc.)
- ✅ Can import from Services, Utils, Constants, Types
- ✅ Cannot import from Components
- ✅ One hook per file
- ✅ Use barrel exports (`index.ts`)

**File Naming:**
- Pattern: `use{HookName}.ts`
- Examples: `useDrawingState.ts`, `useViewportTransform.ts`

**Example:**
```typescript
// src/hooks/useDrawingState.ts
import { useState, useCallback } from 'react';
import { DrawingPhase, Pt } from '../types';

export function useDrawingState() {
  const [phase, setPhase] = useState<DrawingPhase>('idle');
  const [startPt, setStartPt] = useState<Pt | null>(null);
  
  const startDrawing = useCallback((pt: Pt) => {
    setPhase('waiting-for-end');
    setStartPt(pt);
  }, []);
  
  return { phase, startPt, startDrawing };
}
```

---

### 6. Components Layer (`src/components/`)

**Purpose:** Render UI and handle user interactions

**Rules:**
- ✅ Can import from all layers
- ✅ Should not import from other components (prefer composition)
- ✅ Props-based (receive data via props)
- ✅ Type-safe (strongly typed props)
- ✅ Organize in feature subdirectories
- ✅ Use barrel exports (`index.ts`)

**Directory Structure:**
```
components/
└── DrawingCanvas/      # Main canvas feature
    ├── WidthHUD.tsx
    ├── DrawButton.tsx
    ├── Sidebar.tsx
    ├── BottomBar.tsx
    ├── CanvasRenderer.tsx
    ├── __tests__/
    └── index.ts
```

**File Naming:**
- Pattern: `{ComponentName}.tsx`
- Examples: `WidthHUD.tsx`, `Sidebar.tsx`

**Example:**
```typescript
// src/components/DrawingCanvas/WidthHUD.tsx
import { Line } from '../../types';

export interface WidthHUDProps {
  selectedLine: Line | null;
  position: { x: number; y: number } | null;
  onWidthChange: (newWidth: number) => void;
}

export function WidthHUD(props: WidthHUDProps): JSX.Element | null {
  if (!props.selectedLine || !props.position) return null;
  
  return (
    <div>
      {/* HUD content */}
    </div>
  );
}
```

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| **Types** | `{domain}.types.ts` | `canvas.types.ts` |
| **Constants** | `{domain}.constants.ts` | `scale.constants.ts` |
| **Utils** | `{function-group}.ts` | `points.ts`, `lines.ts` |
| **Services** | `{Domain}Service.ts` | `DrawingService.ts` |
| **Hooks** | `use{HookName}.ts` | `useDrawingState.ts` |
| **Components** | `{ComponentName}.tsx` | `WidthHUD.tsx` |
| **Tests** | `{name}.test.ts(x)` | `geometry.test.ts` |
| **Directories** | Singular for utils/types/constants | `util/`, `type/`, `constant/` |
| **Directories** | Plural for collections | `components/`, `hooks/`, `services/` |

### Code Elements

| Type | Convention | Example |
|------|------------|---------|
| **Interfaces** | PascalCase | `Pt`, `Line`, `ViewportTransform` |
| **Types** | PascalCase | `DrawingPhase`, `SnapType` |
| **Constants** | SCREAMING_SNAKE_CASE | `ZOOM_FACTOR`, `MIN_LINE_LENGTH` |
| **Functions** | camelCase | `dist`, `createLine`, `findSnapTarget` |
| **Components** | PascalCase | `WidthHUD`, `Sidebar`, `BottomBar` |
| **Hooks** | camelCase with `use` prefix | `useDrawingState`, `useViewportTransform` |

---

## Import Organization

### Import Order

1. External libraries (React, etc.)
2. Internal types
3. Internal constants
4. Internal utilities
5. Internal services
6. Internal hooks
7. Internal components
8. Styles

**Example:**
```typescript
// External
import { useState, useCallback } from 'react';

// Types
import { Pt, Line, DrawingPhase } from '../types';

// Constants
import { MIN_LINE_LENGTH } from '../constants';

// Utils
import { dist } from '../utils/geometry';

// Services
import { createLine } from '../services/drawing';

// Hooks
import { useDrawingState } from '../hooks';

// Components
import { WidthHUD } from './WidthHUD';

// Styles
import './styles.css';
```

### Import Paths

- ✅ Use barrel exports: `import { Pt, Line } from '../types';`
- ✅ Use relative paths for same layer: `import { dist } from './geometry';`
- ❌ Avoid deep imports: `import { Pt } from '../types/canvas.types';`

---

## Testing Organization

### Test File Location

- Place tests in `__tests__/` directory within the same layer
- Mirror the source file structure

**Example:**
```
src/utils/
├── geometry/
│   ├── points.ts
│   └── lines.ts
└── __tests__/
    └── geometry.test.ts
```

### Test File Naming

- Pattern: `{name}.test.ts` or `{name}.test.tsx`
- Examples: `geometry.test.ts`, `WidthHUD.test.tsx`

---

## Documentation Requirements

### JSDoc Comments

All exported functions, interfaces, and components must have JSDoc comments:

```typescript
/**
 * Calculate Euclidean distance between two points
 * @param a - First point
 * @param b - Second point
 * @returns Distance in pixels
 */
export function dist(a: Pt, b: Pt): number {
  // ...
}
```

### README Files

Each major directory should have a README.md explaining:
- Purpose of the directory
- Organization structure
- Usage examples
- Related documentation

---

## Barrel Exports

### Purpose

Barrel exports (`index.ts`) provide clean import paths and encapsulation.

### Rules

- ✅ Create `index.ts` in each directory
- ✅ Re-export all public APIs
- ✅ Don't export internal helpers
- ✅ Keep barrel exports simple (no logic)

**Example:**
```typescript
// src/types/index.ts
export * from './canvas.types';
export * from './drawing.types';
export * from './scale.types';
export * from './snap.types';
```

---

## Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md` - System architecture overview
- **Dependency Flow:** `docs/DEPENDENCY_FLOW.md` - Dependency rules and diagram
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach
- **Contributing:** `CONTRIBUTING.md` - Contribution guidelines

