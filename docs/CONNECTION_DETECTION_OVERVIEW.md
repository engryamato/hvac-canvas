# Connection Detection System - Complete Overview

## Quick Start

**What:** Implement line endpoint connection detection for HVAC Canvas
**Why:** Track when line endpoints coincide and maintain this information as users draw, drag, duplicate, or delete lines
**How:** Build a connection graph that updates in real-time
**Time:** 6-8 hours across 7 phases

---

## Documentation Files

### 1. **CONNECTION_DETECTION_SUMMARY.md** ⭐ START HERE
- Executive summary of the entire system
- High-level architecture overview
- Key design decisions
- Success criteria
- Future enhancements

### 2. **CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md**
- Detailed phase-by-phase breakdown
- Code snippets for each phase
- Algorithm explanations
- Test coverage requirements
- Implementation order

### 3. **CONNECTION_DETECTION_CODE_EXAMPLES.md**
- Complete type definitions
- Full ConnectionService implementation
- useLineStore integration code
- Usage examples
- Test examples
- Performance analysis

### 4. **CONNECTION_DETECTION_CHECKLIST.md**
- Detailed checklist for each phase
- Specific tasks to complete
- Verification steps
- Common issues and solutions
- Tips for implementation

### 5. **CONNECTION_DETECTION_OVERVIEW.md** (this file)
- Quick reference guide
- File structure
- Key concepts
- Quick lookup table

---

## System Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Components Layer                      │
│  DrawingCanvas.tsx  │  LinePropertiesModal.tsx          │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Hooks Layer                         │
│              useLineStore (with connections)            │
│  - connections: ConnectionGraph                         │
│  - getConnectedEndpoints(lineId, endpoint)             │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Services Layer                        │
│              ConnectionService.ts                        │
│  - buildConnectionGraph(lines, tolerance)              │
│  - getConnectedEndpoints(graph, lineId, endpoint)      │
│  - normalizeCoordinate(value, tolerance)               │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Constants Layer                        │
│  CONNECTION_TOLERANCE_PX = 20px                         │
│  (reuses SNAP_THRESHOLD_ENDPOINT)                       │
└──────────────────────────┬──────────────────────────────┘
                           │ defines
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Types Layer                         │
│  LineEndpoint, LineConnection, LineConnectionMap,       │
│  ConnectionGraph                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### LineEndpoint
```typescript
type LineEndpoint = 'a' | 'b';
```
Represents which end of a line (start or end point).

### LineConnection
```typescript
interface LineConnection {
  lineId: string;      // ID of connected line
  endpoint: LineEndpoint;  // Which endpoint ('a' or 'b')
}
```
Represents a single connection between two endpoints.

### LineConnectionMap
```typescript
interface LineConnectionMap {
  a: LineConnection[];  // Connections at endpoint 'a'
  b: LineConnection[];  // Connections at endpoint 'b'
}
```
All connections for a single line.

### ConnectionGraph
```typescript
type ConnectionGraph = Record<string, LineConnectionMap>;
```
Complete connection information for all lines.

---

## Implementation Phases

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Types & Constants | 30 min | [ ] |
| 2 | ConnectionService | 1-2 hrs | [ ] |
| 3 | Store Integration | 1 hr | [ ] |
| 4 | Canvas Integration | 30 min | [ ] |
| 5 | UI Exposure | 1 hr | [ ] |
| 6 | Testing & Validation | 2-3 hrs | [ ] |
| 7 | Documentation | 30 min | [ ] |

---

## Files to Create

```
src/services/drawing/
├── ConnectionService.ts (NEW)
└── __tests__/
    └── ConnectionService.test.ts (NEW)

docs/
├── CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md (NEW)
├── CONNECTION_DETECTION_CODE_EXAMPLES.md (NEW)
├── CONNECTION_DETECTION_SUMMARY.md (NEW)
├── CONNECTION_DETECTION_CHECKLIST.md (NEW)
└── CONNECTION_DETECTION_OVERVIEW.md (NEW - this file)
```

---

## Files to Modify

```
src/types/
├── drawing.types.ts (ADD types)
└── index.ts (EXPORT types)

src/constants/
├── snap.constants.ts (ADD constant)
└── index.ts (EXPORT constant)

src/hooks/
├── useLineStore.ts (ADD connections)
└── __tests__/
    └── useLineStore.test.ts (ADD tests)

src/components/
└── LinePropertiesModal.tsx (DISPLAY connections)

src/DrawingCanvas.tsx (USE connections)

docs/
├── COMPONENT_REFERENCE.md (UPDATE)
└── IMPLEMENTATION_COMPLETE.md (UPDATE)
```

---

## Algorithm Overview

### buildConnectionGraph(lines, tolerance)

```
1. Group all endpoints by normalized coordinates
   - Normalize: round to nearest tolerance bucket
   - Example: (105, 115) with tolerance 20 → (100, 120)

2. For each group with 2+ endpoints:
   - Create bidirectional connections
   - Example: If (100, 100) has 3 endpoints:
     - Each endpoint connects to the other 2

3. Return complete ConnectionGraph
   - Maps lineId → {a: connections[], b: connections[]}
```

### Complexity
- **Time:** O(n) where n = number of lines
- **Space:** O(n) for graph storage
- **Per-group:** O(k²) where k = endpoints in group (typically 2-3)

---

## Data Flow Example

```
User draws Line A: (0,0) → (100,0)
User draws Line B: (100,0) → (100,100)
  ↓
useLineStore.addLine(lineB)
  ↓
useMemo detects lines changed
  ↓
buildConnectionGraph([lineA, lineB], 20)
  ↓
Normalize endpoints:
  - lineA.b = (100,0) → bucket (100,0)
  - lineB.a = (100,0) → bucket (100,0)
  ↓
Same bucket! Create connection
  ↓
Return: {
  lineA: {a: [], b: [{lineId: lineB, endpoint: 'a'}]},
  lineB: {a: [{lineId: lineA, endpoint: 'b'}], b: []}
}
  ↓
Components re-render with new connections
  ↓
LinePropertiesModal displays:
  "Line A endpoint b connected to Line B endpoint a"
```

---

## Testing Strategy

### Unit Tests (ConnectionService)
- Coordinate normalization
- Graph building (2 lines, 3+ lines, no connections)
- Tolerance boundaries
- Edge cases

### Integration Tests (useLineStore)
- Connections update after addLine
- Connections update after removeLine
- Connections update after updateLine
- getConnectedEndpoints works correctly

### Manual Testing
- Draw connected lines
- Drag endpoints
- Duplicate lines
- Delete lines
- Multi-branch junctions

### Performance Testing
- 50 lines
- 100 lines
- 200 lines

---

## Success Criteria Checklist

- [ ] Connection graph builds correctly
- [ ] Connections update in real-time
- [ ] Connections persist through operations
- [ ] UI displays connections clearly
- [ ] Tests pass with >95% coverage
- [ ] No performance degradation
- [ ] Documentation complete

---

## Quick Reference: Key Functions

### ConnectionService

```typescript
// Normalize coordinate to tolerance bucket
normalizeCoordinate(value: number, tolerance: number): number

// Build complete connection graph
buildConnectionGraph(lines: Line[], tolerance: number): ConnectionGraph

// Get connections for specific endpoint
getConnectedEndpoints(
  graph: ConnectionGraph,
  lineId: string,
  endpoint: LineEndpoint
): LineConnection[]

// Get all connections for a line
getConnectionsForLine(
  graph: ConnectionGraph,
  lineId: string
): LineConnectionMap | null
```

### useLineStore

```typescript
// From hook return object
connections: ConnectionGraph
getConnectedEndpoints(lineId: string, endpoint: LineEndpoint): LineConnection[]
```

---

## Common Questions

**Q: What tolerance is used?**
A: 20px (CONNECTION_TOLERANCE_PX = SNAP_THRESHOLD_ENDPOINT)

**Q: How are endpoints grouped?**
A: By normalized coordinates within tolerance bucket

**Q: When does the graph update?**
A: Whenever lines array changes (via useMemo)

**Q: What's the performance impact?**
A: O(n) computation, memoized to avoid unnecessary rebuilds

**Q: Can I customize tolerance?**
A: Yes, pass tolerance parameter to buildConnectionGraph()

**Q: What about floating-point precision?**
A: Handled by normalizeCoordinate() rounding

---

## Next Steps

1. **Read:** CONNECTION_DETECTION_SUMMARY.md
2. **Plan:** Review CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md
3. **Code:** Follow CONNECTION_DETECTION_CODE_EXAMPLES.md
4. **Track:** Use CONNECTION_DETECTION_CHECKLIST.md
5. **Implement:** Phase 1 → Phase 7
6. **Test:** Run tests after each phase
7. **Document:** Update docs as you go

---

## Support Resources

- **Architecture:** See mermaid diagrams in IMPLEMENTATION_PLAN.md
- **Code:** See examples in CODE_EXAMPLES.md
- **Checklist:** Use CHECKLIST.md to track progress
- **Questions:** See FAQ in SUMMARY.md

---

## Version History

- **v1.0** - Initial comprehensive plan created
- **Created:** 2025-10-22
- **Status:** Ready for implementation

---

## Related Documentation

- `docs/ARCHITECTURE.md` - Overall system architecture
- `docs/COMPONENT_REFERENCE.md` - Component documentation
- `docs/MODULE_GUIDELINES.md` - Module organization guidelines
- `docs/DEPENDENCY_FLOW.md` - Dependency relationships

