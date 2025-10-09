# Dependency Flow

**Last Updated:** 2025-10-09  
**Version:** 1.0

---

## Overview

This document defines the dependency flow rules for the HVAC Canvas 7-layer architecture. These rules ensure a clean, maintainable codebase with no circular dependencies.

---

## Dependency Flow Diagram

```
┌─────────────────────────────────────────┐
│          Components (UI Layer)          │  ← Can import from all layers below
│         8 files, 41 tests               │
└─────────────────┬───────────────────────┘
                  │ ↓ Allowed
┌─────────────────┴───────────────────────┐
│        Hooks (State Management)         │  ← Can import from Services, Utils, Constants, Types
│         8 files, 34 tests               │
└─────────────────┬───────────────────────┘
                  │ ↓ Allowed
┌─────────────────┴───────────────────────┐
│       Services (Domain Logic)           │  ← Can import from Utils, Constants, Types
│         9 files, 50 tests               │
└─────────────────┬───────────────────────┘
                  │ ↓ Allowed
┌─────────────────┴───────────────────────┐
│      Utils (Pure Functions)             │  ← Can import from Constants, Types
│         17 files, 51 tests              │
└─────────────────┬───────────────────────┘
                  │ ↓ Allowed
┌─────────────────┴───────────────────────┐
│    Constants (Configuration)            │  ← Can import from Types only
│         5 files                         │
└─────────────────┬───────────────────────┘
                  │ ↓ Allowed
┌─────────────────┴───────────────────────┐
│       Types (Type Definitions)          │  ← Foundation layer (no imports)
│         5 files                         │
└─────────────────────────────────────────┘
```

---

## Dependency Rules

### Layer 1: Types (Foundation)

**Can import from:**
- ❌ Nothing (foundation layer)

**Can be imported by:**
- ✅ All layers

**Purpose:** Define data structures and contracts

**Example:**
```typescript
// ✅ Allowed: No imports
export interface Pt {
  x: number;
  y: number;
}

// ❌ Not allowed: Importing from other layers
import { ZOOM_FACTOR } from '../constants'; // VIOLATION
```

---

### Layer 2: Constants

**Can import from:**
- ✅ Types

**Can be imported by:**
- ✅ Utils, Services, Hooks, Components

**Purpose:** Define configuration values

**Example:**
```typescript
// ✅ Allowed: Import from Types
import { Scale } from '../types';

export const ARCHITECTURAL_SCALES: Scale[] = [
  // ...
];

// ❌ Not allowed: Importing from Utils or above
import { dist } from '../utils'; // VIOLATION
```

---

### Layer 3: Utils

**Can import from:**
- ✅ Types
- ✅ Constants

**Can be imported by:**
- ✅ Services, Hooks, Components

**Purpose:** Pure utility functions

**Example:**
```typescript
// ✅ Allowed: Import from Types and Constants
import { Pt } from '../../types';
import { MIN_LINE_LENGTH } from '../../constants';

export function dist(a: Pt, b: Pt): number {
  // ...
}

// ❌ Not allowed: Importing from Services or above
import { createLine } from '../../services'; // VIOLATION
```

---

### Layer 4: Services

**Can import from:**
- ✅ Types
- ✅ Constants
- ✅ Utils

**Can be imported by:**
- ✅ Hooks, Components

**Purpose:** Domain logic orchestration

**Example:**
```typescript
// ✅ Allowed: Import from Utils, Constants, Types
import { Pt, Line } from '../../types';
import { MIN_LINE_LENGTH } from '../../constants';
import { dist } from '../../utils/geometry';

export function createLine(start: Pt, end: Pt, width: number): Line | null {
  const length = dist(start, end);
  if (length < MIN_LINE_LENGTH) return null;
  // ...
}

// ❌ Not allowed: Importing from Hooks or Components
import { useDrawingState } from '../../hooks'; // VIOLATION
```

---

### Layer 5: Hooks

**Can import from:**
- ✅ Types
- ✅ Constants
- ✅ Utils
- ✅ Services

**Can be imported by:**
- ✅ Components

**Purpose:** Stateful logic and side effects

**Example:**
```typescript
// ✅ Allowed: Import from Services, Utils, Constants, Types
import { useState, useCallback } from 'react';
import { DrawingPhase, Pt } from '../types';
import { createLine } from '../services/drawing';

export function useDrawingState() {
  const [phase, setPhase] = useState<DrawingPhase>('idle');
  // ...
}

// ❌ Not allowed: Importing from Components
import { WidthHUD } from '../components'; // VIOLATION
```

---

### Layer 6: Components

**Can import from:**
- ✅ Types
- ✅ Constants
- ✅ Utils
- ✅ Services
- ✅ Hooks

**Can be imported by:**
- ⚠️ Other components (discouraged, prefer composition)

**Purpose:** UI rendering and user interactions

**Example:**
```typescript
// ✅ Allowed: Import from all layers below
import { Line } from '../../types';
import { useDrawingState } from '../../hooks';
import { createLine } from '../../services/drawing';

export function DrawingCanvas() {
  const { phase, startDrawing } = useDrawingState();
  // ...
}

// ⚠️ Discouraged: Importing from other components
import { WidthHUD } from './WidthHUD'; // Prefer composition via props
```

---

## Dependency Matrix

| From ↓ / To → | Types | Constants | Utils | Services | Hooks | Components |
|---------------|-------|-----------|-------|----------|-------|------------|
| **Types** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Constants** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Utils** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Services** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Hooks** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Components** | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |

**Legend:**
- ✅ Allowed
- ❌ Not allowed (violation)
- ⚠️ Discouraged (prefer composition)

---

## Circular Dependency Prevention

### What is a Circular Dependency?

A circular dependency occurs when two or more modules depend on each other, creating a cycle:

```
A imports B → B imports C → C imports A  (CIRCULAR!)
```

### Why Avoid Circular Dependencies?

- ❌ Makes code harder to understand
- ❌ Can cause initialization issues
- ❌ Prevents tree-shaking
- ❌ Indicates poor separation of concerns

### How We Prevent Them

1. **Enforced Dependency Flow** - Strict top-to-bottom dependency rules
2. **Architecture Tests** - Automated tests validate dependency rules
3. **Code Reviews** - Manual verification during PR reviews
4. **Barrel Exports** - Clean import paths prevent accidental cycles

---

## Validation

### Automated Testing

We use architecture tests to automatically validate dependency rules:

```typescript
// tests/architecture.test.ts
describe('Dependency Flow Rules', () => {
  it('should not have Hooks importing from Components', () => {
    // Scans all hook files and checks imports
  });
  
  it('should not have circular dependencies', () => {
    // Builds dependency graph and detects cycles
  });
});
```

**Run tests:**
```bash
npm run test:unit -- tests/architecture.test.ts --run
```

### Manual Verification

During code reviews, verify:
1. ✅ Imports follow dependency flow rules
2. ✅ No circular dependencies introduced
3. ✅ Files in appropriate directories
4. ✅ Barrel exports updated

---

## Common Violations and Solutions

### Violation 1: Service Importing from Hook

**Problem:**
```typescript
// ❌ services/drawing/DrawingService.ts
import { useDrawingState } from '../../hooks';

export function createLine() {
  const { phase } = useDrawingState(); // WRONG!
}
```

**Solution:**
```typescript
// ✅ services/drawing/DrawingService.ts
export function createLine(start: Pt, end: Pt, width: number): Line | null {
  // Services are stateless - accept data as parameters
}

// ✅ hooks/useDrawingState.ts
import { createLine } from '../services/drawing';

export function useDrawingState() {
  const finishDrawing = () => {
    const line = createLine(startPt, endPt, width); // Correct!
  };
}
```

### Violation 2: Util Importing from Service

**Problem:**
```typescript
// ❌ utils/geometry/lines.ts
import { createLine } from '../../services/drawing';

export function calculateLength() {
  const line = createLine(...); // WRONG!
}
```

**Solution:**
```typescript
// ✅ utils/geometry/lines.ts
export function calculateLength(start: Pt, end: Pt): number {
  // Utils are pure functions - no service dependencies
  return dist(start, end);
}

// ✅ services/drawing/DrawingService.ts
import { calculateLength } from '../../utils/geometry';

export function createLine(start: Pt, end: Pt, width: number): Line | null {
  const length = calculateLength(start, end); // Correct!
}
```

### Violation 3: Component Importing from Component

**Problem:**
```typescript
// ❌ components/DrawingCanvas/Sidebar.tsx
import { WidthHUD } from './WidthHUD';

export function Sidebar() {
  return <WidthHUD />; // Creates tight coupling
}
```

**Solution:**
```typescript
// ✅ components/DrawingCanvas/Sidebar.tsx
export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return <div>{children}</div>; // Accept via composition
}

// ✅ components/DrawingCanvas/index.tsx
import { Sidebar } from './Sidebar';
import { WidthHUD } from './WidthHUD';

export function DrawingCanvas() {
  return (
    <Sidebar>
      <WidthHUD {...props} />
    </Sidebar>
  );
}
```

---

## Benefits of Dependency Flow

### 1. Maintainability
- Clear structure makes code easier to understand
- Changes in lower layers don't affect upper layers
- Easy to locate where logic belongs

### 2. Testability
- Each layer can be tested independently
- Pure functions (Utils) are easy to test
- Services can be tested without UI

### 3. Reusability
- Lower layers (Utils, Services) are highly reusable
- No coupling to UI or state management
- Easy to extract into shared libraries

### 4. Scalability
- New features follow established patterns
- Team members know where to add code
- Parallel development is easier

---

## Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md` - System architecture overview
- **Module Guidelines:** `docs/MODULE_GUIDELINES.md` - Module organization rules
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach
- **ADRs:** `docs/adrs/` - Architectural decisions

---

## Enforcement

### CI/CD Pipeline

Our GitHub Actions CI pipeline runs architecture tests on every PR:

```yaml
# .github/workflows/ci.yml
- name: Run architecture tests
  run: npm run test:unit -- tests/architecture.test.ts --run
```

### Pre-commit Hooks (Optional)

You can add pre-commit hooks to validate dependencies locally:

```bash
# .git/hooks/pre-commit
npm run test:unit -- tests/architecture.test.ts --run
```

---

## Questions?

If you're unsure where code belongs or how to structure dependencies:

1. Review this document and `docs/MODULE_GUIDELINES.md`
2. Look at existing code for examples
3. Ask in code review
4. Consult the team lead

**Remember:** When in doubt, follow the dependency flow! ⬇️

