# Connection Detection Implementation Checklist

## Phase 1: Type Definitions & Constants ⏱️ 30 min

### Types
- [ ] Add `LineEndpoint` type to `src/types/drawing.types.ts`
- [ ] Add `LineConnection` interface to `src/types/drawing.types.ts`
- [ ] Add `LineConnectionMap` interface to `src/types/drawing.types.ts`
- [ ] Add `ConnectionGraph` type to `src/types/drawing.types.ts`
- [ ] Add JSDoc comments to all new types
- [ ] Export all types from `src/types/index.ts`
- [ ] Verify types compile without errors

### Constants
- [ ] Add `CONNECTION_TOLERANCE_PX` to `src/constants/snap.constants.ts`
- [ ] Set value to `SNAP_THRESHOLD_ENDPOINT` (20px)
- [ ] Add JSDoc explaining tolerance and alignment with snap system
- [ ] Export from `src/constants/index.ts`
- [ ] Verify constant is accessible

### Verification
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run type-check` - no errors
- [ ] Verify types are exported correctly

---

## Phase 2: ConnectionService Implementation ⏱️ 1-2 hours

### Core Service
- [ ] Create `src/services/drawing/ConnectionService.ts`
- [ ] Implement `normalizeCoordinate(value, tolerance)` function
  - [ ] Rounds to nearest tolerance bucket
  - [ ] Handles negative numbers correctly
  - [ ] Has JSDoc with examples
- [ ] Implement `buildConnectionGraph(lines, tolerance)` function
  - [ ] Groups endpoints by normalized coordinates
  - [ ] Creates bidirectional connections
  - [ ] Handles empty line arrays
  - [ ] Handles single line (no connections)
  - [ ] Handles multi-branch junctions (3+ lines)
  - [ ] Has JSDoc with algorithm explanation
- [ ] Implement `getConnectedEndpoints(graph, lineId, endpoint)` function
  - [ ] Returns array of LineConnection
  - [ ] Returns empty array if line not found
  - [ ] Has JSDoc with examples
- [ ] Implement `getConnectionsForLine(graph, lineId)` function
  - [ ] Returns LineConnectionMap or null
  - [ ] Has JSDoc

### Service Tests
- [ ] Create `src/services/drawing/__tests__/ConnectionService.test.ts`
- [ ] Test `normalizeCoordinate()`
  - [ ] Positive coordinates
  - [ ] Negative coordinates
  - [ ] Zero
  - [ ] Boundary values
- [ ] Test `buildConnectionGraph()`
  - [ ] Empty array
  - [ ] Single line (no connections)
  - [ ] Two lines connected at endpoint
  - [ ] Two lines not connected (outside tolerance)
  - [ ] Three lines at same point (multi-branch)
  - [ ] Mixed connected and unconnected lines
  - [ ] Tolerance boundary cases
- [ ] Test `getConnectedEndpoints()`
  - [ ] Returns correct connections
  - [ ] Returns empty array for non-existent line
  - [ ] Returns empty array for unconnected endpoint
- [ ] Test `getConnectionsForLine()`
  - [ ] Returns correct map
  - [ ] Returns null for non-existent line

### Verification
- [ ] All tests pass: `npm run test -- ConnectionService`
- [ ] Coverage >95%
- [ ] No TypeScript errors
- [ ] Service exports correctly from `src/services/drawing/index.ts`

---

## Phase 3: Store Integration ⏱️ 1 hour

### Hook Updates
- [ ] Import ConnectionService functions in `src/hooks/useLineStore.ts`
- [ ] Import CONNECTION_TOLERANCE_PX constant
- [ ] Add `connections: ConnectionGraph` to state (via useMemo)
- [ ] Add `getConnectedEndpoints` callback
- [ ] Update `UseLineStoreReturn` interface
  - [ ] Add `connections: ConnectionGraph`
  - [ ] Add `getConnectedEndpoints` method signature
- [ ] Verify memoization dependency array includes `lines`
- [ ] Add JSDoc to new properties

### Hook Tests
- [ ] Update `src/hooks/__tests__/useLineStore.test.ts`
- [ ] Test connections update after `addLine()`
- [ ] Test connections update after `removeLine()`
- [ ] Test connections update after `updateLine()`
- [ ] Test `getConnectedEndpoints()` returns correct connections
- [ ] Test connections persist through multiple operations
- [ ] Test memoization (connections don't change if lines don't)

### Verification
- [ ] All hook tests pass: `npm run test -- useLineStore`
- [ ] Coverage >95%
- [ ] No TypeScript errors
- [ ] Hook exports correctly

---

## Phase 4: Canvas & Interaction Pipeline ⏱️ 30 min

### DrawingCanvas Integration
- [ ] Import `connections` and `getConnectedEndpoints` from store
- [ ] Verify endpoint dragging works with connections
- [ ] Verify snapping + connections work together
- [ ] Test that dragging endpoint updates connections
- [ ] Test that snapping maintains junction integrity

### Verification
- [ ] Manual test: Draw two connected lines
- [ ] Manual test: Drag endpoint away - connection breaks
- [ ] Manual test: Drag endpoint back - connection reforms
- [ ] Manual test: Snap endpoint to another line - connection forms

---

## Phase 5: UI Exposure ⏱️ 1 hour

### LinePropertiesModal Updates
- [ ] Add connection display section
- [ ] Show endpoint A connections
- [ ] Show endpoint B connections
- [ ] Display connected line IDs
- [ ] Display connected endpoints
- [ ] Make line IDs clickable (optional)
- [ ] Add styling for connection section

### Optional: Visual Indicators
- [ ] Add connection node rendering to CanvasRenderService (optional)
- [ ] Small circles at junction points (optional)
- [ ] Highlight on hover (optional)

### Verification
- [ ] Manual test: Select connected line - see connections in modal
- [ ] Manual test: Select unconnected line - see "No connections"
- [ ] Manual test: Create connection - modal updates
- [ ] Manual test: Break connection - modal updates

---

## Phase 6: Testing & Validation ⏱️ 2-3 hours

### Unit Tests
- [ ] ConnectionService tests complete (Phase 2)
- [ ] useLineStore tests complete (Phase 3)
- [ ] All tests pass: `npm run test`
- [ ] Coverage >95%

### Integration Tests
- [ ] Test connection detection with real line operations
- [ ] Test connections survive line modifications
- [ ] Test connections with duplicated lines
- [ ] Test connections with deleted lines

### E2E Tests (Optional)
- [ ] Add Playwright test for connection workflow
- [ ] Test: Draw → Connect → Verify in modal
- [ ] Test: Drag → Disconnect → Verify in modal
- [ ] Test: Duplicate → Verify connections copied

### Manual Testing Scenarios
- [ ] Scenario 1: Draw two lines that touch
  - [ ] Verify connection detected
  - [ ] Verify shown in modal
- [ ] Scenario 2: Drag line away
  - [ ] Verify connection removed
  - [ ] Verify modal updated
- [ ] Scenario 3: Drag line back
  - [ ] Verify connection reformed
  - [ ] Verify modal updated
- [ ] Scenario 4: Duplicate connected line
  - [ ] Verify duplicate has same connections
  - [ ] Verify original unchanged
- [ ] Scenario 5: Delete connected line
  - [ ] Verify other line's connections updated
  - [ ] Verify modal updated
- [ ] Scenario 6: Multi-branch junction
  - [ ] Draw 3+ lines at same point
  - [ ] Verify all connections detected
  - [ ] Verify modal shows all connections

### Performance Testing
- [ ] Test with 50 lines
- [ ] Test with 100 lines
- [ ] Test with 200 lines
- [ ] Verify no lag in connection updates
- [ ] Verify no memory leaks

### Verification
- [ ] All tests pass: `npm run test`
- [ ] All E2E tests pass: `npm run test:e2e`
- [ ] No console errors
- [ ] No performance issues

---

## Phase 7: Documentation ⏱️ 30 min

### Code Documentation
- [ ] All functions have JSDoc comments
- [ ] All types have JSDoc comments
- [ ] Examples provided where helpful
- [ ] Algorithm explained in buildConnectionGraph

### Component Reference
- [ ] Update `docs/COMPONENT_REFERENCE.md`
- [ ] Add Connection Detection section
- [ ] Document types
- [ ] Document constants
- [ ] Document services
- [ ] Document hook additions

### Implementation Complete
- [ ] Update `docs/IMPLEMENTATION_COMPLETE.md`
- [ ] Add connection detection to feature list
- [ ] Note integration points

### Architecture Notes
- [ ] Document how connections integrate with snapping
- [ ] Document tolerance alignment
- [ ] Document performance characteristics

### Verification
- [ ] All documentation is accurate
- [ ] All code examples compile
- [ ] No broken links
- [ ] Consistent with existing documentation style

---

## Final Verification Checklist

### Code Quality
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] Coverage >95%: `npm run test:coverage`

### Build & Runtime
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in dev
- [ ] No console errors in production build
- [ ] App runs without crashes

### User Experience
- [ ] Connections display correctly in modal
- [ ] Connections update in real-time
- [ ] No lag or performance issues
- [ ] Visual feedback is clear

### Documentation
- [ ] All documentation updated
- [ ] Code examples are accurate
- [ ] Architecture is clear
- [ ] Future developers can understand system

---

## Sign-Off

- [ ] All phases complete
- [ ] All tests passing
- [ ] All documentation updated
- [ ] Ready for code review
- [ ] Ready for merge

---

## Notes

### Common Issues & Solutions

**Issue:** Connections not updating after line change
- **Solution:** Verify useMemo dependency array includes `lines`

**Issue:** Floating-point precision causing missed connections
- **Solution:** Verify normalizeCoordinate() is rounding correctly

**Issue:** Performance degradation with many lines
- **Solution:** Verify buildConnectionGraph is O(n), not O(n²)

**Issue:** Connections not showing in modal
- **Solution:** Verify getConnectedEndpoints is called correctly

### Tips for Implementation

1. **Start with Phase 1** - Types and constants are quick and foundational
2. **Test Phase 2 thoroughly** - ConnectionService is the core logic
3. **Use the examples** - Code examples in CONNECTION_DETECTION_CODE_EXAMPLES.md
4. **Test incrementally** - Don't wait until the end to test
5. **Manual testing is important** - Verify user experience works
6. **Document as you go** - Don't leave documentation for the end

### Resources

- Implementation Plan: `docs/CONNECTION_DETECTION_IMPLEMENTATION_PLAN.md`
- Code Examples: `docs/CONNECTION_DETECTION_CODE_EXAMPLES.md`
- Executive Summary: `docs/CONNECTION_DETECTION_SUMMARY.md`
- Architecture Diagram: See mermaid diagrams in plan

