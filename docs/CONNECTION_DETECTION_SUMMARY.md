# Connection Detection System - Executive Summary

## What is Being Built?

A **connection detection system** that tracks when line endpoints coincide (within tolerance) and maintains this information as users draw, drag, duplicate, or delete lines.

**Core Capability:** "Line A connects to Line B at Line A's endpoint b and Line B's endpoint a"

---

## Why This Matters

1. **Foundation for Advanced Features**
   - Branch flow calculations
   - Collision detection
   - Network analysis
   - Duct system validation

2. **User Experience**
   - Visual feedback on connections
   - Prevents accidental disconnections
   - Enables smart duplication (copies maintain connections)

3. **Data Integrity**
   - Always know which lines are connected
   - Automatic updates as lines change
   - No manual connection management

---

## System Architecture

### Layered Design

```
Types Layer
  ↓ (defines)
Constants Layer
  ↓ (uses)
Services Layer (ConnectionService)
  ↓ (consumed by)
Hooks Layer (useLineStore)
  ↓ (used by)
Components Layer (DrawingCanvas, LinePropertiesModal)
```

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **LineEndpoint** | Type for 'a' or 'b' | `src/types/drawing.types.ts` |
| **LineConnection** | Single connection record | `src/types/drawing.types.ts` |
| **LineConnectionMap** | Connections for one line | `src/types/drawing.types.ts` |
| **ConnectionGraph** | All connections | `src/types/drawing.types.ts` |
| **CONNECTION_TOLERANCE_PX** | Tolerance constant (20px) | `src/constants/snap.constants.ts` |
| **ConnectionService** | Graph building logic | `src/services/drawing/ConnectionService.ts` |
| **useLineStore** | Integration point | `src/hooks/useLineStore.ts` |

---

## How It Works

### 1. Coordinate Normalization

Endpoints are grouped by normalized coordinates within tolerance:

```
Tolerance = 20px
Point (105, 115) → Bucket (100, 120)
Point (110, 110) → Bucket (100, 100)
Point (100, 100) → Bucket (100, 100) ← Same bucket!
```

### 2. Connection Graph Building

```
Input: [Line A, Line B, Line C]
  ↓
Group endpoints by normalized coordinates
  ↓
For each group with 2+ endpoints:
  Create bidirectional connections
  ↓
Output: ConnectionGraph
```

### 3. Real-Time Updates

```
User draws/moves/deletes line
  ↓
useLineStore.lines changes
  ↓
useMemo detects change
  ↓
buildConnectionGraph() runs
  ↓
connections updated
  ↓
Components re-render with new connection info
```

---

## Data Structures

### ConnectionGraph Example

```typescript
{
  'line-1': {
    a: [],  // No connections at endpoint a
    b: [
      {lineId: 'line-2', endpoint: 'a'},  // Connected to line-2's endpoint a
      {lineId: 'line-3', endpoint: 'a'}   // Also connected to line-3's endpoint a
    ]
  },
  'line-2': {
    a: [{lineId: 'line-1', endpoint: 'b'}],  // Connected to line-1's endpoint b
    b: []
  },
  'line-3': {
    a: [{lineId: 'line-1', endpoint: 'b'}],  // Connected to line-1's endpoint b
    b: []
  }
}
```

---

## Implementation Phases

### Phase 1: Types & Constants (30 min)
- Add LineEndpoint, LineConnection, LineConnectionMap, ConnectionGraph types
- Add CONNECTION_TOLERANCE_PX constant
- Update barrel exports

### Phase 2: ConnectionService (1-2 hours)
- Implement normalizeCoordinate()
- Implement buildConnectionGraph()
- Implement helper functions
- Write comprehensive tests

### Phase 3: Store Integration (1 hour)
- Add connections to useLineStore
- Add getConnectedEndpoints() helper
- Update hook tests

### Phase 4: Canvas Integration (30 min)
- Thread connections into DrawingCanvas
- Ensure endpoint dragging maintains junctions
- Verify snapping + connections work together

### Phase 5: UI Exposure (1 hour)
- Add connection display to LinePropertiesModal
- Show connected line IDs and endpoints
- Optional: Add visual indicators on canvas

### Phase 6: Testing (2-3 hours)
- Unit tests for ConnectionService
- Integration tests for useLineStore
- E2E tests for user workflows

### Phase 7: Documentation (30 min)
- Update COMPONENT_REFERENCE.md
- Update IMPLEMENTATION_COMPLETE.md
- Add architecture notes

**Total Time: 6-8 hours**

---

## Key Design Decisions

### 1. Tolerance-Based Grouping
- **Why:** Avoids floating-point precision issues
- **How:** Round coordinates to nearest tolerance bucket
- **Benefit:** Robust, predictable grouping

### 2. Bidirectional Connections
- **Why:** Easy to query "what's connected to this endpoint?"
- **How:** Store connections in both directions
- **Benefit:** O(1) lookup time

### 3. Memoized Graph in Hook
- **Why:** Avoid rebuilding graph on every render
- **How:** useMemo with lines as dependency
- **Benefit:** Performance, automatic updates

### 4. Reuse SNAP_THRESHOLD_ENDPOINT
- **Why:** Keep snapping and connection detection aligned
- **How:** CONNECTION_TOLERANCE_PX = SNAP_THRESHOLD_ENDPOINT
- **Benefit:** Consistent user experience

---

## Success Criteria

✅ Connection graph builds correctly for all line configurations
✅ Connections update in real-time as lines are modified
✅ Connections persist through drag, duplicate, and delete operations
✅ UI displays connection information clearly
✅ All tests pass with >95% coverage
✅ No performance degradation with 100+ lines
✅ Documentation is complete and accurate

---

## Future Enhancements

1. **Visual Indicators**
   - Small circles at junction points
   - Highlight connected lines on hover

2. **Advanced Features**
   - Branch flow calculations
   - Network analysis
   - Automatic layout suggestions

3. **Validation**
   - Warn on disconnections
   - Suggest reconnections
   - Validate duct system topology

---

## Files to Create/Modify

### New Files
- `src/services/drawing/ConnectionService.ts`
- `src/services/drawing/__tests__/ConnectionService.test.ts`
- `docs/CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md`
- `docs/CONNECTION_DETECTION_CODE_EXAMPLES.md`
- `docs/CONNECTION_DETECTION_SUMMARY.md`

### Modified Files
- `src/types/drawing.types.ts` (add types)
- `src/types/index.ts` (export types)
- `src/constants/snap.constants.ts` (add constant)
- `src/constants/index.ts` (export constant)
- `src/hooks/useLineStore.ts` (integrate graph)
- `src/hooks/__tests__/useLineStore.test.ts` (add tests)
- `src/DrawingCanvas.tsx` (use connections)
- `src/components/LinePropertiesModal.tsx` (display connections)
- `docs/COMPONENT_REFERENCE.md` (document)
- `docs/IMPLEMENTATION_COMPLETE.md` (document)

---

## Getting Started

1. **Read the Plan:** `docs/CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md`
2. **Review Code Examples:** `docs/CONNECTION_DETECTION_CODE_EXAMPLES.md`
3. **Start Phase 1:** Add types and constants
4. **Follow Phases 2-7:** Implement in order
5. **Run Tests:** Verify each phase works
6. **Update Docs:** Keep documentation current

---

## Questions & Clarifications

**Q: What if endpoints are exactly on top of each other?**
A: They'll be in the same bucket and connected.

**Q: What if endpoints are 19px apart (within 20px tolerance)?**
A: They'll be in the same bucket and connected.

**Q: What if endpoints are 21px apart (outside tolerance)?**
A: They'll be in different buckets and NOT connected.

**Q: What happens when I drag a connected endpoint?**
A: The connection updates in real-time as the endpoint moves.

**Q: What happens when I duplicate a connected line?**
A: The duplicate maintains the same connections at the same coordinates.

**Q: What happens when I delete a connected line?**
A: The other line's connections are updated automatically.

