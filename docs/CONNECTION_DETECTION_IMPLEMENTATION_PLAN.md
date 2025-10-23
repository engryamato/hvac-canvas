# Connection Detection Implementation Plan

## Overview

This document outlines the comprehensive plan to implement line endpoint connection detection in HVAC Canvas. The system will track when line endpoints coincide (within tolerance) and maintain this information as users draw, drag, duplicate, or delete lines.

**Core Capability:** "Line A connects to Line B at Line A's endpoint b and Line B's endpoint a"

---

## Phase 1: Type Definitions & Constants

### 1.1 Add Connection Types to `src/types/drawing.types.ts`

```typescript
/**
 * Represents a single endpoint of a line (either 'a' or 'b')
 */
export type LineEndpoint = 'a' | 'b';

/**
 * Represents a connection between two line endpoints
 */
export interface LineConnection {
  /** ID of the connected line */
  lineId: string;
  /** Which endpoint of the connected line ('a' or 'b') */
  endpoint: LineEndpoint;
}

/**
 * Connection map for a single line
 * Maps each endpoint to all lines connected at that point
 */
export interface LineConnectionMap {
  /** Lines connected at endpoint 'a' */
  a: LineConnection[];
  /** Lines connected at endpoint 'b' */
  b: LineConnection[];
}

/**
 * Complete connection graph for all lines
 * Keyed by line ID, maps to connection info for that line
 */
export type ConnectionGraph = Record<string, LineConnectionMap>;
```

### 1.2 Update `src/types/index.ts`

Export the new connection types:
```typescript
export type {
  LineEndpoint,
  LineConnection,
  LineConnectionMap,
  ConnectionGraph,
} from './drawing.types';
```

### 1.3 Add CONNECTION_TOLERANCE_PX to `src/constants/snap.constants.ts`

```typescript
/**
 * Connection tolerance for endpoint coincidence detection (pixels)
 * Reuses SNAP_THRESHOLD_ENDPOINT to keep snapping and connection detection aligned
 * Two endpoints are considered connected if within this distance
 */
export const CONNECTION_TOLERANCE_PX = SNAP_THRESHOLD_ENDPOINT; // 20px
```

### 1.4 Update `src/constants/index.ts`

Export the new constant:
```typescript
export {
  // ... existing exports
  CONNECTION_TOLERANCE_PX,
} from './snap.constants';
```

---

## Phase 2: ConnectionService Implementation

### 2.1 Create `src/services/drawing/ConnectionService.ts`

**Key Functions:**

1. **`normalizeCoordinate(value: number, tolerance: number): number`**
   - Rounds coordinates to nearest tolerance bucket
   - Enables grouping endpoints that are within tolerance

2. **`buildConnectionGraph(lines: Line[], tolerance: number): ConnectionGraph`**
   - Iterates through all lines and their endpoints
   - Groups endpoints by normalized coordinates
   - For each group, creates bidirectional connections
   - Returns complete connection map

3. **`getConnectedEndpoints(graph: ConnectionGraph, lineId: string, endpoint: LineEndpoint): LineConnection[]`**
   - Looks up connections for a specific line endpoint
   - Returns array of connected lines

4. **`getConnectionsForLine(graph: ConnectionGraph, lineId: string): LineConnectionMap | null`**
   - Returns all connections for a line
   - Returns null if line not in graph

**Algorithm for buildConnectionGraph:**
```
1. Create empty map: coordinateGroups = {}
2. For each line in lines:
   - For each endpoint (a, b):
     - Normalize endpoint coordinates
     - Create key: `${normalizedX},${normalizedY}`
     - Add {lineId, endpoint} to coordinateGroups[key]
3. Create empty graph: connectionGraph = {}
4. For each line:
   - Initialize connectionGraph[lineId] = {a: [], b: []}
5. For each coordinate group with 2+ endpoints:
   - For each endpoint in group:
     - For each other endpoint in group:
       - Add connection from first to second
6. Return connectionGraph
```

### 2.2 Create `src/services/drawing/__tests__/ConnectionService.test.ts`

**Test Coverage:**
- Two-line connections (endpoint to endpoint)
- Multi-branch junctions (3+ lines meeting at one point)
- Tolerance behavior (within/outside tolerance)
- No false positives (endpoints outside tolerance)
- Bidirectional connections
- Isolated lines (no connections)
- Graph updates after line modifications

---

## Phase 3: Store Integration

### 3.1 Update `src/hooks/useLineStore.ts`

Add to the hook:

```typescript
// Compute connection graph with useMemo
const connections = useMemo(() => {
  return buildConnectionGraph(lines, CONNECTION_TOLERANCE_PX);
}, [lines]);

// Add helper methods
const getConnectedEndpoints = useCallback(
  (lineId: string, endpoint: LineEndpoint) => {
    return getConnectionsForLine(connections, lineId)?.[endpoint] ?? [];
  },
  [connections]
);

// Expose in return object
return {
  // ... existing returns
  connections,
  getConnectedEndpoints,
};
```

### 3.2 Update `src/hooks/useLineStore.ts` Return Type

Add to `UseLineStoreReturn`:
```typescript
/** Connection graph for all lines */
connections: ConnectionGraph;
/** Get connected endpoints for a specific line endpoint */
getConnectedEndpoints: (lineId: string, endpoint: LineEndpoint) => LineConnection[];
```

### 3.3 Update Hook Tests

Add tests to `src/hooks/__tests__/useLineStore.test.ts`:
- Verify connections update after addLine
- Verify connections update after removeLine
- Verify connections update after updateLine
- Verify getConnectedEndpoints returns correct connections

---

## Phase 4: Canvas & Interaction Pipeline

### 4.1 Update `src/DrawingCanvas.tsx`

In the component:

```typescript
// Get connections from store
const { connections, getConnectedEndpoints } = lineStore;

// When dragging endpoints (around line 606):
// After snapping, rebuild connections
// Ensure snapped endpoints maintain junction integrity
```

### 4.2 Endpoint Dragging Logic

When user drags an endpoint:
1. Snap detection works as before
2. After snap, connection graph updates automatically (via useMemo)
3. Connected endpoints move together if snapped to same point

---

## Phase 5: UI Exposure

### 5.1 Update `src/components/LinePropertiesModal.tsx`

Add new section showing connections:

```typescript
// For each selected line, show:
// - Endpoint A connections: "Connected to Line-XYZ at endpoint b"
// - Endpoint B connections: "Connected to Line-ABC at endpoint a"
```

Display format:
- Line ID (clickable to select that line)
- Connected endpoint
- Visual indicator (small dot or icon)

### 5.2 Optional: Visual Indicators

In `src/services/drawing/CanvasRenderService.ts`:
- Add optional rendering of connection nodes
- Small circles at junction points
- Can be toggled via UI setting

---

## Phase 6: Testing & Validation

### 6.1 Unit Tests

- ConnectionService: 15+ tests
- useLineStore integration: 8+ tests
- End-to-end scenarios: 5+ tests

### 6.2 Manual Testing Scenarios

1. Draw two lines that touch at endpoints
2. Verify connection is detected
3. Drag one line away
4. Verify connection is removed
5. Duplicate a connected line
6. Verify new line has same connections
7. Delete a connected line
8. Verify other line's connections update

### 6.3 Playwright E2E Tests

Add scenarios to `tests/e2e/`:
- Connection detection after drawing
- Connection persistence after dragging
- Connection updates after duplication
- Connection cleanup after deletion

---

## Phase 7: Documentation

### 7.1 Update `docs/COMPONENT_REFERENCE.md`

Add section:
```markdown
### Connection Detection

**Types:**
- `LineEndpoint` - 'a' | 'b'
- `LineConnection` - {lineId, endpoint}
- `LineConnectionMap` - {a: LineConnection[], b: LineConnection[]}
- `ConnectionGraph` - Record<lineId, LineConnectionMap>

**Constants:**
- `CONNECTION_TOLERANCE_PX` - 20px (from SNAP_THRESHOLD_ENDPOINT)

**Services:**
- `buildConnectionGraph(lines, tolerance)` - Build complete graph
- `getConnectedEndpoints(graph, lineId, endpoint)` - Get connections
```

### 7.2 Update `docs/IMPLEMENTATION_COMPLETE.md`

Add connection detection to feature list.

### 7.3 Add Architecture Note

Document how connections integrate with snapping system.

---

## Implementation Order

1. **Phase 1** - Types & Constants (30 min)
2. **Phase 2** - ConnectionService (1-2 hours)
3. **Phase 3** - Store Integration (1 hour)
4. **Phase 4** - Canvas Integration (30 min)
5. **Phase 5** - UI Exposure (1 hour)
6. **Phase 6** - Testing (2-3 hours)
7. **Phase 7** - Documentation (30 min)

**Total Estimated Time:** 6-8 hours

---

## Success Criteria

✅ Connection graph builds correctly for all line configurations
✅ Connections update in real-time as lines are modified
✅ Connections persist through drag, duplicate, and delete operations
✅ UI displays connection information clearly
✅ All tests pass with >95% coverage
✅ No performance degradation with 100+ lines
✅ Documentation is complete and accurate

