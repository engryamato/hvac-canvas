# HVAC Canvas - Testing Strategy

**Last Updated:** 2025-10-09  
**Version:** 2.0 (Post-Refactoring)

---

## Overview

The HVAC Canvas application employs a comprehensive testing strategy with **176 unit tests** achieving **~80% overall coverage** and **29/30 E2E tests** passing. Testing is organized by architectural layer with appropriate coverage targets for each.

---

## Testing Pyramid

```
        /\
       /E2\      E2E Tests (29/30 passing)
      /____\     - Full user flows
     /      \    - Browser automation
    / Unit  \   Unit Tests (176 passing)
   /  Tests  \  - Layer-specific testing
  /___________\ - Fast, isolated, comprehensive
```

### Test Distribution

| Layer | Tests | Coverage | Target | Status |
|-------|-------|----------|--------|--------|
| **Utils** | 51 | ~95% | 80% | ✅ Exceeded |
| **Services** | 50 | ~100% | 80% | ✅ Exceeded |
| **Hooks** | 34 | ~100% | 70% | ✅ Exceeded |
| **Components** | 41 | ~95% | 70% | ✅ Exceeded |
| **E2E** | 29/30 | N/A | 30/30 | 🟡 1 pending |
| **Overall** | 176 | ~80% | 80% | ✅ Met Target |

---

## Unit Testing

### Test Framework

**Vitest 3.2.4** - Fast, modern testing framework

**Why Vitest:**
- ✅ Fast execution (~1.6s for 176 tests)
- ✅ Native ESM support
- ✅ Compatible with Vite build tool
- ✅ Jest-compatible API
- ✅ Built-in coverage reporting

### Test Organization

```
src/
├── utils/__tests__/
│   ├── geometry.test.ts (13 tests)
│   ├── canvas.test.ts (10 tests)
│   ├── snap.test.ts (9 tests)
│   ├── scale.test.ts (14 tests)
│   └── id.test.ts (5 tests)
├── services/__tests__/
│   ├── DrawingService.test.ts (13 tests)
│   ├── LineManager.test.ts (18 tests)
│   └── ViewportService.test.ts (19 tests)
├── hooks/__tests__/
│   ├── useDrawingState.test.ts (7 tests)
│   ├── useViewportTransform.test.ts (13 tests)
│   └── useKeyboardShortcuts.test.ts (14 tests)
└── components/DrawingCanvas/__tests__/
    ├── WidthHUD.test.tsx (10 tests)
    ├── DrawButton.test.tsx (5 tests)
    ├── Sidebar.test.tsx (8 tests)
    ├── BottomBar.test.tsx (9 tests)
    └── CanvasRenderer.test.tsx (9 tests)
```

---

## Layer-Specific Testing

### 1. Utils Testing

**Approach:** Pure function testing with comprehensive edge cases

**Example:**
```typescript
describe('dist', () => {
  it('should calculate distance between two points', () => {
    expect(dist({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
  
  it('should return 0 for same point', () => {
    expect(dist({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });
  
  it('should handle negative coordinates', () => {
    expect(dist({ x: -3, y: -4 }, { x: 0, y: 0 })).toBe(5);
  });
});
```

**Coverage Target:** ≥80% (achieved ~95%)

**Test Patterns:**
- ✅ Normal cases
- ✅ Edge cases (zero, negative, max values)
- ✅ Boundary conditions
- ✅ Error cases (if applicable)

### 2. Services Testing

**Approach:** Stateless function testing with immutability verification

**Example:**
```typescript
describe('addLine', () => {
  it('should add line to collection', () => {
    const lines = [mockLine1];
    const result = addLine(lines, mockLine2);
    
    expect(result).toHaveLength(2);
    expect(result).toContain(mockLine2);
  });
  
  it('should not mutate original array', () => {
    const lines = [mockLine1];
    const original = [...lines];
    
    addLine(lines, mockLine2);
    
    expect(lines).toEqual(original);
  });
});
```

**Coverage Target:** ≥80% (achieved ~100%)

**Test Patterns:**
- ✅ Normal operations
- ✅ Validation logic
- ✅ Immutability verification
- ✅ Edge cases (empty arrays, null values)

### 3. Hooks Testing

**Approach:** React Testing Library with renderHook and act

**Example:**
```typescript
import { renderHook, act } from '@testing-library/react';

describe('useDrawingState', () => {
  it('should start in idle phase', () => {
    const { result } = renderHook(() => useDrawingState());
    expect(result.current.phase).toBe('idle');
  });
  
  it('should transition to waiting-for-end', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startDrawing({ x: 0, y: 0 });
    });
    
    expect(result.current.phase).toBe('waiting-for-end');
  });
});
```

**Coverage Target:** ≥70% (achieved ~100%)

**Test Patterns:**
- ✅ Initial state
- ✅ State transitions
- ✅ Callback invocations
- ✅ Dependency arrays (no stale closures)

### 4. Components Testing

**Approach:** React Testing Library with user interaction simulation

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('WidthHUD', () => {
  it('should not render when no line selected', () => {
    const { container } = render(
      <WidthHUD selectedLine={null} position={{x: 0, y: 0}} onWidthChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
  
  it('should call onWidthChange when slider changes', () => {
    const onWidthChange = vi.fn();
    render(<WidthHUD selectedLine={mockLine} position={{x: 0, y: 0}} onWidthChange={onWidthChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '15' } });
    
    expect(onWidthChange).toHaveBeenCalledWith(15);
  });
});
```

**Coverage Target:** ≥70% (achieved ~95%)

**Test Patterns:**
- ✅ Rendering with props
- ✅ User interactions (clicks, input changes)
- ✅ Callback invocations
- ✅ Conditional rendering (null states, empty states)
- ✅ Accessibility (ARIA labels, roles)

---

## E2E Testing

### Test Framework

**Playwright** - Modern browser automation

**Why Playwright:**
- ✅ Cross-browser support (Chromium, Firefox, WebKit)
- ✅ Fast and reliable
- ✅ Auto-wait for elements
- ✅ Network interception
- ✅ Screenshot/video capture

### Test Organization

```
tests/
└── e2e/
    └── drawing-canvas.spec.ts (30 tests, 29 passing)
```

### Test Scenarios

**Drawing Operations:**
- ✅ Draw line (click-click)
- ✅ Snap to endpoint
- ✅ Snap to midpoint
- ✅ Snap to line
- ✅ Cancel drawing (Escape)

**Selection & Editing:**
- ✅ Select line (click)
- ✅ Edit width (HUD slider)
- ✅ Delete line (Delete key)
- ✅ Deselect (Escape)

**Viewport:**
- ✅ Zoom in/out (buttons, wheel, keyboard)
- ✅ Pan (right-click drag)
- ✅ Reset zoom (button, keyboard)

**UI Interactions:**
- ✅ Toggle draw mode (button, keyboard)
- ✅ Collapse/expand sidebar
- ✅ View line summary

**Current Status:** 29/30 passing (1 test pending fix)

---

## Coverage Reporting

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
      ],
    },
  },
});
```

### Running Coverage

```bash
# Run tests with coverage
npm run test:unit -- --coverage

# View HTML report
open coverage/index.html
```

### Coverage Thresholds

**Current Thresholds:**
- Overall: ≥80% ✅
- Utils: ≥80% ✅
- Services: ≥80% ✅
- Hooks: ≥70% ✅
- Components: ≥70% ✅

---

## Test Execution

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- src/utils/__tests__/geometry.test.ts

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e -- --headed
```

### Performance

**Unit Tests:**
- **Execution Time:** ~1.6s for 176 tests
- **Average:** ~9ms per test
- **Parallel Execution:** Yes (Vitest default)

**E2E Tests:**
- **Execution Time:** ~30s for 30 tests
- **Average:** ~1s per test
- **Parallel Execution:** Yes (Playwright default)

---

## Testing Best Practices

### 1. Test Naming

```typescript
// ✅ Descriptive test names
it('should calculate distance between two points', () => { /* ... */ });
it('should return null when line is too short', () => { /* ... */ });

// ❌ Vague test names
it('works', () => { /* ... */ });
it('test1', () => { /* ... */ });
```

### 2. Arrange-Act-Assert

```typescript
it('should add line to collection', () => {
  // Arrange
  const lines = [mockLine1];
  const newLine = mockLine2;
  
  // Act
  const result = addLine(lines, newLine);
  
  // Assert
  expect(result).toHaveLength(2);
  expect(result).toContain(newLine);
});
```

### 3. Test Isolation

```typescript
// ✅ Each test is independent
describe('LineManager', () => {
  it('should add line', () => {
    const lines = [];
    const result = addLine(lines, mockLine);
    expect(result).toHaveLength(1);
  });
  
  it('should remove line', () => {
    const lines = [mockLine];
    const result = removeLine(lines, mockLine.id);
    expect(result).toHaveLength(0);
  });
});

// ❌ Tests depend on each other
let lines = [];
it('should add line', () => {
  lines = addLine(lines, mockLine);
  expect(lines).toHaveLength(1);
});
it('should remove line', () => {
  lines = removeLine(lines, mockLine.id);
  expect(lines).toHaveLength(0);
});
```

### 4. Mock Sparingly

```typescript
// ✅ Test real implementations when possible
it('should create line', () => {
  const line = createLine({ x: 0, y: 0 }, { x: 100, y: 0 }, 8);
  expect(line).not.toBeNull();
});

// ❌ Over-mocking
it('should create line', () => {
  vi.mock('../utils/geometry');
  vi.mock('../utils/id');
  // ... too much mocking
});
```

### 5. Test Edge Cases

```typescript
describe('dist', () => {
  it('should handle normal case', () => { /* ... */ });
  it('should handle same point (zero distance)', () => { /* ... */ });
  it('should handle negative coordinates', () => { /* ... */ });
  it('should handle very large numbers', () => { /* ... */ });
});
```

---

## Continuous Integration

### GitHub Actions (Future)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run build
```

---

## Future Improvements

### Potential Enhancements

1. **Visual Regression Testing** - Chromatic or Percy
2. **Performance Testing** - Lighthouse CI
3. **Mutation Testing** - Stryker
4. **Coverage Badges** - Display in README
5. **Test Reports** - HTML reports in CI

---

## Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md` - System design
- **ADRs:** `docs/adrs/` - Testing decisions
- **Directory READMEs:** `src/*/README.md` - Layer-specific testing info

