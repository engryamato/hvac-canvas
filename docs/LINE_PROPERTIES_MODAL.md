# Line Properties Modal - Implementation Documentation

**Feature:** Comprehensive Duct Property Editor  
**Status:** 🚧 In Development (Phase 1 Complete)  
**Last Updated:** 2025-10-12  
**Wireframes:** [Notion - Line Properties Modal Wireframes](https://www.notion.so/Line-Properties-Modal-Wireframes-cad8bca63e5a413793a0dd2bb698f85f)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Model](#data-model)
4. [Constants Reference](#constants-reference)
5. [Type Definitions](#type-definitions)
6. [Implementation Status](#implementation-status)
7. [Usage Examples](#usage-examples)
8. [Development Guidelines](#development-guidelines)

---

## Overview

### Purpose

The Line Properties Modal is a comprehensive floating panel that replaces the simple WidthHUD component with a full-featured duct property editor. It provides HVAC professionals with the ability to:

- **Edit duct properties:** Type (Supply/Return), width, material, gauge, layer
- **Calculate airflow:** Automatic velocity, friction, and pressure calculations
- **Manage metadata:** Notes, tags, custom properties, timestamps
- **Batch edit:** Multi-select mode for editing multiple ducts simultaneously

### Key Features

- **220px compact width** - Minimal canvas obstruction
- **Three-tab interface** - Properties, Calculations, Advanced
- **Smart positioning** - Floats near selected line with 16px viewport clearance
- **Real-time calculations** - HVAC formulas with validation and warnings
- **Multi-select support** - Batch operations with mixed value handling
- **Full accessibility** - ARIA labels, keyboard navigation, screen reader support

### Design Specifications

- **Modal Width:** 220px
- **Tab Heights:** 280px (collapsed) / 480px (expanded) for Properties, 320px for Calculations, 360px for Advanced
- **Colors:** Supply Blue (#2563eb), Return Red (#dc2626)
- **Animations:** 200ms open, 150ms close, 300ms expand/collapse
- **Positioning:** Below-center (preferred), above-center, right, left with 16px clearance

---

## Architecture

The Line Properties Modal follows the application's strict layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  Components (UI Layer)                                      │
│  - LinePropertiesModal/                                     │
│    - LinePropertiesModal.tsx (main component)               │
│    - ModalHeader.tsx, TabBar.tsx, ModalFooter.tsx          │
│    - PropertiesTab/, CalculationsTab/, AdvancedTab/         │
│    - MultiSelect/, shared/                                  │
├─────────────────────────────────────────────────────────────┤
│  Hooks (State Management)                                   │
│  - useModalPosition.ts (positioning logic)                  │
│  - useModalAnimation.ts (open/close animations)             │
│  - useModalKeyboard.ts (keyboard navigation)                │
├─────────────────────────────────────────────────────────────┤
│  Services (Business Logic)                                  │
│  - LinePropertiesService.ts (CRUD operations)               │
│    - updateLineProperties, validateLineProperties           │
│    - batchUpdateLines, duplicateLine                        │
│    - calculateAggregateStats, getMixedValue                 │
├─────────────────────────────────────────────────────────────┤
│  Utils (Pure Functions)                                     │
│  - hvac/calculations.ts (HVAC formulas)                     │
│    - calculateVelocity, calculateFriction, calculatePressure│
│    - formatCalculationResult, suggestOptimalWidth           │
│  - modal/positioning.ts (modal placement)                   │
│    - calculateModalPosition, checkBoundaryCollision         │
├─────────────────────────────────────────────────────────────┤
│  Constants (Configuration)                                  │
│  - duct.constants.ts (duct properties)                      │
│  - modal.constants.ts (dimensions, animations)              │
│  - calculations.constants.ts (HVAC formulas)                │
├─────────────────────────────────────────────────────────────┤
│  Types (Data Structures)                                    │
│  - drawing.types.ts (Line, DuctType, Material, Gauge)       │
│  - duct.types.ts (MaterialOption, GaugeOption, etc.)        │
│  - modal.types.ts (ModalTab, ModalPosition, etc.)           │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Flow

**Strict Top-Down Dependencies:**
- Components → Hooks → Services → Utils → Constants/Types
- No circular dependencies
- Each layer only imports from layers below

---

## Data Model

### Line Type (Extended)

The `Line` type has been extended with comprehensive duct properties:

```typescript
export type Line = {
  // Core geometry (existing)
  id: string;                    // Unique identifier
  a: Pt;                         // Start point {x, y}
  b: Pt;                         // End point {x, y}
  width: number;                 // Duct width in inches
  color: string;                 // Stroke color (derived from type)
  
  // Duct properties (new)
  type: DuctType;                // 'supply' | 'return'
  layer: string;                 // Layer assignment
  material: Material;            // Duct material
  gauge: Gauge;                  // Sheet metal gauge
  airflow: number;               // CFM (Cubic Feet per Minute)
  
  // Metadata (new)
  notes: string;                 // User notes (max 120 chars)
  tags: string[];                // Tags for categorization
  customProperties: Record<string, string>;  // Project-specific data
  metadata: LineMetadata;        // Timestamps
};
```

### Supporting Types

```typescript
// Duct type
export type DuctType = 'supply' | 'return';

// Material options
export type Material = 
  | 'Galvanized Steel'
  | 'Stainless Steel'
  | 'Aluminum'
  | 'Fiberglass'
  | 'Flex Duct';

// Gauge options (sheet metal thickness)
export type Gauge = '26ga' | '24ga' | '22ga' | '20ga' | '18ga';

// Metadata
export type LineMetadata = {
  createdAt: number;   // Unix timestamp (ms)
  updatedAt: number;   // Unix timestamp (ms)
};
```

### Default Values

All new lines are created with these defaults:

```typescript
{
  type: 'supply',
  layer: 'Default',
  material: 'Galvanized Steel',
  gauge: '26ga',
  airflow: 0,
  notes: '',
  tags: [],
  customProperties: {},
  metadata: {
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}
```

---

## Constants Reference

### Duct Constants (`duct.constants.ts`)

**DUCT_TYPES**
```typescript
{
  supply: { value: 'supply', label: 'Supply', color: '#2563eb' },
  return: { value: 'return', label: 'Return', color: '#dc2626' }
}
```

**STANDARD_WIDTHS**
```typescript
[4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]
// All even numbers from 4" to 40"
```

**QUICK_WIDTH_CHIPS**
```typescript
[6, 8, 10, 12, 14]
// Most common sizes for quick-select buttons
```

**MATERIALS**
- Galvanized Steel (most common)
- Stainless Steel (corrosion-resistant)
- Aluminum (lightweight)
- Fiberglass (insulated)
- Flex Duct (flexible)

**GAUGES**
- 26ga (0.019" thick) - Lightest
- 24ga (0.024" thick)
- 22ga (0.030" thick)
- 20ga (0.036" thick)
- 18ga (0.048" thick) - Heaviest

**LAYERS**
- Default, Supply, Return, Exhaust, Fresh Air

### Modal Constants (`modal.constants.ts`)

**Dimensions (pixels)**
```typescript
MODAL_WIDTH = 220
MODAL_PADDING = 16
EDGE_CLEARANCE = 16
TAB_HEIGHT = 36
HEADER_HEIGHT = 32
FOOTER_HEIGHT = 40
INPUT_HEIGHT = 32
BUTTON_HEIGHT = 40
CHIP_HEIGHT_MEDIUM = 28  // Width chips
CHIP_HEIGHT_SMALL = 24   // Tag chips
```

**Tab Heights (pixels)**
```typescript
PROPERTIES_TAB_HEIGHT_COLLAPSED = 280
PROPERTIES_TAB_HEIGHT_EXPANDED = 480
CALCULATIONS_TAB_HEIGHT = 320
ADVANCED_TAB_HEIGHT = 360
```

**Animations (milliseconds)**
```typescript
ANIMATION_OPEN = 200
ANIMATION_CLOSE = 150
ANIMATION_EXPAND = 300
DROPDOWN_ANIMATION = 150
TRANSITION_REPOSITION = 200
```

**Limits**
```typescript
NOTE_MAX_LENGTH = 120  // Characters
MAX_RECOMMENDED_VELOCITY = 1500  // fpm
```

### Calculation Constants (`calculations.constants.ts`)

**Wright Equation (Friction Loss)**
```typescript
COEFFICIENT = 0.109136
CFM_EXPONENT = 1.9
DIAMETER_EXPONENT = 5.02
```

**Velocity Pressure**
```typescript
VELOCITY_PRESSURE_CONSTANT = 4005
// Formula: VP = (V / 4005)²
```

**Precision (decimal places)**
```typescript
VELOCITY = 0      // Whole numbers
FRICTION = 2      // 0.08 in.wc
PRESSURE = 4      // 0.0034 in
LENGTH = 1        // 14.7"
```

---

## Type Definitions

### Modal Types (`modal.types.ts`)

**ModalTab**
```typescript
type ModalTab = 'properties' | 'calculations' | 'advanced';
```

**ModalPosition**
```typescript
interface ModalPosition {
  x: number;                    // Canvas X coordinate
  y: number;                    // Canvas Y coordinate
  placement: 'below' | 'above' | 'left' | 'right';
}
```

**CalculationResults**
```typescript
interface CalculationResults {
  velocity: number;             // Air velocity (fpm)
  friction: number;             // Friction loss (in.wc/100ft)
  pressure: number;             // Velocity pressure (in)
  hasWarning: boolean;          // Velocity > 1500 fpm
  suggestedWidth?: number;      // Optimal width if warning
}
```

**MultiSelectState**
```typescript
interface MultiSelectState {
  selectedLineIds: string[];    // IDs of selected lines
  isMultiSelect: boolean;       // Multi-select mode active
  aggregateStats: AggregateStats;
  mixedValues: Set<keyof Line>; // Properties that differ
}
```

**AggregateStats**
```typescript
interface AggregateStats {
  count: number;                // Number of selected lines
  totalLength: number;          // Sum of lengths (inches)
  totalLengthFormatted: string; // "14.7\"" or "14' 7\""
}
```

### Duct Types (`duct.types.ts`)

**MaterialOption**
```typescript
interface MaterialOption {
  value: Material;
  label: string;
  description: string;
  commonUses: string[];
}
```

**GaugeOption**
```typescript
interface GaugeOption {
  value: Gauge;
  label: string;               // "26 ga"
  thickness: number;           // 0.019
  thicknessDisplay: string;    // "0.019\" thick"
}
```

**DuctTypeConfig**
```typescript
interface DuctTypeConfig {
  value: DuctType;
  label: string;               // "Supply" or "Return"
  color: string;               // "#2563eb" or "#dc2626"
  description: string;
}
```

---

## Implementation Status

### ✅ Phase 1: Foundation Layer - COMPLETE (14/14 tasks)

**Completed:**
- ✅ Extended Line type with duct properties
- ✅ Created duct.types.ts (MaterialOption, GaugeOption, etc.)
- ✅ Created modal.types.ts (ModalTab, ModalPosition, etc.)
- ✅ Created duct.constants.ts (DUCT_TYPES, MATERIALS, GAUGES, etc.)
- ✅ Created modal.constants.ts (dimensions, animations)
- ✅ Created calculations.constants.ts (HVAC formulas)
- ✅ Updated barrel exports (types/index.ts, constants/index.ts)

**Files Created:**
- `src/types/drawing.types.ts` (updated)
- `src/types/duct.types.ts`
- `src/types/modal.types.ts`
- `src/constants/duct.constants.ts`
- `src/constants/modal.constants.ts`
- `src/constants/calculations.constants.ts`

### 🚧 Phase 2: Utility Layer - Pending (10 tasks)

**Planned:**
- HVAC calculation utilities (velocity, friction, pressure)
- Calculation formatting and validation
- Modal positioning logic
- Optimal width suggestions

### 🚧 Phase 3-13: Remaining Phases - Pending (79 tasks)

**Roadmap:**
- Phase 3: Service Layer (8 tasks)
- Phase 4: Shared UI Components (11 tasks)
- Phase 5: Properties Tab (10 tasks)
- Phase 6: Calculations Tab (6 tasks)
- Phase 7: Advanced Tab (8 tasks)
- Phase 8: Multi-Select Mode (7 tasks)
- Phase 9: Main Modal Assembly (8 tasks)
- Phase 10: Styling & Design Tokens (6 tasks)
- Phase 11: Accessibility (8 tasks)
- Phase 12: Integration with DrawingCanvas (10 tasks)
- Phase 13: Testing & Documentation (8 tasks)

**Total Progress:** 14/103 tasks (13.6%)

---

## Usage Examples

### Creating a New Line (After Implementation)

```typescript
import { DEFAULT_DUCT_PROPERTIES } from '@/constants';

const newLine: Line = {
  id: generateId(),
  a: { x: 100, y: 100 },
  b: { x: 200, y: 100 },
  width: 10,
  color: DUCT_TYPES.supply.color,
  ...DEFAULT_DUCT_PROPERTIES,
  metadata: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};
```

### Updating Line Properties (After Implementation)

```typescript
import { updateLineProperties } from '@/services/line/LinePropertiesService';

const updatedLine = updateLineProperties(line, {
  type: 'return',
  color: DUCT_TYPES.return.color,
  width: 12,
  material: 'Stainless Steel',
  gauge: '24ga',
});
```

### Calculating Airflow (After Implementation)

```typescript
import { calculateVelocity, calculateFriction, calculatePressure } from '@/utils/hvac/calculations';

const results: CalculationResults = {
  velocity: calculateVelocity(500, 8),      // 500 CFM, 8" duct
  friction: calculateFriction(1432, 8, 100), // velocity, width, length
  pressure: calculatePressure(1432),         // velocity
  hasWarning: velocity > MAX_RECOMMENDED_VELOCITY,
  suggestedWidth: velocity > 1500 ? suggestOptimalWidth(8, velocity, 1500) : undefined,
};
```

### Multi-Select Operations (After Implementation)

```typescript
import { batchUpdateLines, getMixedValue } from '@/services/line/LinePropertiesService';

// Check if property values are mixed
const typeValue = getMixedValue(selectedLines.map(l => l.type));
// Returns 'supply' if all same, 'mixed' if different

// Apply changes to all selected lines
const updatedLines = batchUpdateLines(allLines, selectedLineIds, {
  material: 'Galvanized Steel',
  gauge: '26ga',
});
```

---

## Development Guidelines

### Adding New Duct Properties

1. **Update Type Definition** (`src/types/drawing.types.ts`)
   ```typescript
   export type Line = {
     // ... existing properties
     newProperty: NewPropertyType;
   };
   ```

2. **Add Constants** (`src/constants/duct.constants.ts`)
   ```typescript
   export const NEW_PROPERTY_OPTIONS = [...];
   ```

3. **Update Default Values**
   ```typescript
   export const DEFAULT_DUCT_PROPERTIES = {
     // ... existing defaults
     newProperty: defaultValue,
   };
   ```

4. **Add UI Component** (in appropriate tab)
   - PropertiesTab for basic properties
   - CalculationsTab for calculated values
   - AdvancedTab for metadata

### HVAC Calculation Formulas

**Velocity (fpm)**
```
V = (CFM × 144) / (W² × π/4)
where:
  V = velocity in feet per minute
  CFM = airflow in cubic feet per minute
  W = duct width in inches
  144 = square inches per square foot
```

**Friction Loss (in.wc/100ft) - Wright Equation**
```
F = (0.109136 × Q^1.9) / (D^5.02)
where:
  F = friction loss
  Q = CFM
  D = equivalent round diameter
  D = 1.30 × ((W × W)^0.625) / ((W + W)^0.25)
```

**Velocity Pressure (in)**
```
VP = (V / 4005)²
where:
  VP = velocity pressure in inches
  V = velocity in fpm
```

### Testing Requirements

**Unit Tests:**
- All utility functions (calculations, positioning)
- All service functions (CRUD, validation)
- All custom hooks

**Component Tests:**
- All shared components (Dropdown, Button, Input, etc.)
- All tab components (PropertiesTab, CalculationsTab, AdvancedTab)
- Multi-select components

**E2E Tests:**
- Modal open/close
- Tab navigation
- Property editing
- Calculations
- Multi-select operations
- Keyboard navigation

### Accessibility Requirements

- **ARIA Labels:** All interactive elements
- **Keyboard Navigation:** Tab, Shift+Tab, Escape, Enter, Arrow keys
- **Focus Management:** Focus trap, return focus on close
- **Screen Readers:** aria-live regions for dynamic content
- **Touch Targets:** Minimum 44px for tablet mode

---

## Related Documentation

- [Notion Wireframes](https://www.notion.so/Line-Properties-Modal-Wireframes-cad8bca63e5a413793a0dd2bb698f85f) - Original design specifications
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [DEPENDENCY_FLOW.md](./DEPENDENCY_FLOW.md) - Dependency management guidelines
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing standards and practices

---

**Next Steps:**
1. Complete Phase 2: Utility Layer (HVAC calculations, modal positioning)
2. Complete Phase 3: Service Layer (business logic)
3. Build UI components (Phases 4-9)
4. Add styling and accessibility (Phases 10-11)
5. Integrate with DrawingCanvas (Phase 12)
6. Comprehensive testing (Phase 13)


