# Components Directory

This directory contains React UI components organized by feature. Components are focused, testable, and compose together to create the application interface.

## Organization

Components are organized by feature:

- **`DrawingCanvas/`** - Main drawing canvas and related UI components
  - `WidthHUD.tsx` - Floating HUD for editing line width
  - `DrawButton.tsx` - Floating action button for draw mode
  - `Sidebar.tsx` - Collapsible sidebar with line summary
  - `BottomBar.tsx` - Bottom bar with zoom controls
  - `CanvasRenderer.tsx` - Canvas element with event handlers
  - `__tests__/` - Component tests
  - `index.ts` - Barrel export

## Test Coverage

All components have comprehensive tests with **~95% coverage**:

```
src/components/DrawingCanvas/__tests__/
├── WidthHUD.test.tsx (10 tests)
├── DrawButton.test.tsx (5 tests)
├── Sidebar.test.tsx (8 tests)
├── BottomBar.test.tsx (9 tests)
└── CanvasRenderer.test.tsx (9 tests)
```

## Component Modules

### WidthHUD

Floating HUD for editing selected line width:

```typescript
export interface WidthHUDProps {
  selectedLine: Line | null;
  position: { x: number; y: number } | null;
  onWidthChange: (newWidth: number) => void;
  hudRef?: React.RefObject<HTMLDivElement>;
}

export function WidthHUD(props: WidthHUDProps): JSX.Element | null;
```

**Features:**
- Displays current line width
- Slider control (1-60px range)
- Numeric display
- Positioned near selected line
- Null-safe (returns null if no line selected)

**Usage:**
```typescript
<WidthHUD
  selectedLine={selectedLine}
  position={hudPosition}
  onWidthChange={handleWidthChange}
/>
```

### DrawButton

Floating action button for toggling draw mode:

```typescript
export interface DrawButtonProps {
  isActive: boolean;
  onToggle: () => void;
  sidebarWidth: number;
}

export function DrawButton(props: DrawButtonProps): JSX.Element;
```

**Features:**
- Visual state indication (active/inactive)
- Positioned relative to sidebar
- Keyboard shortcut hint (D)
- Accessible (ARIA labels)

**Usage:**
```typescript
<DrawButton
  isActive={isDrawActive}
  onToggle={toggleDrawMode}
  sidebarWidth={sidebarWidth}
/>
```

### Sidebar

Collapsible sidebar with line summary:

```typescript
export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  lineSummary: LineSummaryRow[];
  currentScale: Scale;
  width?: number;
}

export function Sidebar(props: SidebarProps): JSX.Element;
```

**Features:**
- Collapsible with toggle button
- Line summary table grouped by width
- Empty state message
- Scale display
- Customizable width

**Usage:**
```typescript
<Sidebar
  collapsed={sidebarCollapsed}
  onToggle={toggleSidebar}
  lineSummary={lineSummary}
  currentScale={currentScale}
  width={320}
/>
```

### BottomBar

Bottom bar with zoom controls:

```typescript
export interface BottomBarProps {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function BottomBar(props: BottomBarProps): JSX.Element;
```

**Features:**
- Zoom in/out buttons
- Reset zoom button
- Zoom percentage display
- Disabled states
- Pan instruction text

**Usage:**
```typescript
<BottomBar
  zoom={viewportScale}
  canZoomIn={canZoomIn}
  canZoomOut={canZoomOut}
  onZoomIn={handleZoomIn}
  onZoomOut={handleZoomOut}
  onResetZoom={handleResetZoom}
/>
```

### CanvasRenderer

Canvas element with all event handlers:

```typescript
export interface CanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isDrawActive: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  sidebarWidth: number;
  children?: React.ReactNode;
}

export function CanvasRenderer(props: CanvasRendererProps): JSX.Element;
```

**Features:**
- Canvas element with refs
- All pointer/mouse/touch event handlers
- Dynamic cursor (crosshair when drawing)
- Container sizing based on sidebar
- Accepts children (HUD, DrawButton)

**Usage:**
```typescript
<CanvasRenderer
  canvasRef={canvasRef}
  containerRef={containerRef}
  isDrawActive={isDrawActive}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onWheel={handleWheel}
  onContextMenu={handleContextMenu}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  sidebarWidth={sidebarWidth}
>
  <WidthHUD {...hudProps} />
  <DrawButton {...buttonProps} />
</CanvasRenderer>
```

## Component Principles

### 1. Single Responsibility

Each component handles one UI concern:

```typescript
// ✅ Single responsibility
<WidthHUD />      // Line width editing only
<Sidebar />       // Line summary only
<BottomBar />     // Zoom controls only

// ❌ Multiple responsibilities
<ControlPanel />  // Width + summary + zoom
```

### 2. Props Over State

Components receive data via props, not internal state:

```typescript
// ✅ Props-based
function WidthHUD({ selectedLine, onWidthChange }: WidthHUDProps) {
  return <input value={selectedLine?.width} onChange={...} />;
}

// ❌ Internal state
function WidthHUD() {
  const [width, setWidth] = useState(8);
  return <input value={width} onChange={...} />;
}
```

### 3. Composition

Components compose together:

```typescript
function DrawingCanvas() {
  return (
    <div>
      <CanvasRenderer {...canvasProps}>
        <WidthHUD {...hudProps} />
        <DrawButton {...buttonProps} />
      </CanvasRenderer>
      <Sidebar {...sidebarProps} />
      <BottomBar {...bottomBarProps} />
    </div>
  );
}
```

### 4. Type Safety

All props are strongly typed:

```typescript
// ✅ Typed props
export interface WidthHUDProps {
  selectedLine: Line | null;
  position: { x: number; y: number } | null;
  onWidthChange: (newWidth: number) => void;
}

// ❌ Untyped props
function WidthHUD(props: any) { /* ... */ }
```

### 5. Accessibility

Components include ARIA labels and roles:

```typescript
<div role="dialog" aria-label="Line width editor">
  <input aria-label="Selected line width" />
</div>

<button aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
  {/* ... */}
</button>
```

## Testing Guidelines

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('ComponentName', () => {
  it('should render with props', () => {
    render(<ComponentName {...props} />);
    expect(screen.getByRole('...')).toBeDefined();
  });
  
  it('should call callback when interacted', () => {
    const onCallback = vi.fn();
    render(<ComponentName onCallback={onCallback} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onCallback).toHaveBeenCalled();
  });
  
  it('should handle null/empty states', () => {
    const { container } = render(<ComponentName data={null} />);
    expect(container.firstChild).toBeNull();
  });
});
```

### Coverage Targets

- **Line Coverage:** ≥70%
- **Branch Coverage:** ≥70%
- **Function Coverage:** 100%

## Adding New Components

When adding new components:

1. **Identify the UI concern** (what does this component do?)
2. **Define props interface** with TypeScript
3. **Write tests first** using React Testing Library
4. **Implement component** with accessibility in mind
5. **Add JSDoc comments** explaining purpose and usage
6. **Export from feature directory** and add to barrel export
7. **Update this README** with usage examples

Example:
```typescript
// src/components/DrawingCanvas/ScaleSelector.tsx

/**
 * Scale selector dropdown
 */
export interface ScaleSelectorProps {
  currentScale: Scale;
  availableScales: Scale[];
  onScaleChange: (scale: Scale) => void;
}

export function ScaleSelector(props: ScaleSelectorProps): JSX.Element {
  const { currentScale, availableScales, onScaleChange } = props;
  
  return (
    <select
      value={currentScale.displayName}
      onChange={(e) => {
        const scale = availableScales.find(s => s.displayName === e.target.value);
        if (scale) onScaleChange(scale);
      }}
      aria-label="Select measurement scale"
    >
      {availableScales.map(scale => (
        <option key={scale.displayName} value={scale.displayName}>
          {scale.displayName}
        </option>
      ))}
    </select>
  );
}

// src/components/DrawingCanvas/__tests__/ScaleSelector.test.tsx
describe('ScaleSelector', () => {
  it('should call onScaleChange when selection changes', () => {
    const onScaleChange = vi.fn();
    render(<ScaleSelector {...props} onScaleChange={onScaleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1/8" = 1\'' } });
    
    expect(onScaleChange).toHaveBeenCalled();
  });
});
```

## Related Documentation

- **ADR-005:** Extract UI Components - Decision rationale
- **Hooks:** `src/hooks/` - Hooks used by components
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach

## Dependencies

Components depend on **Hooks**, **Services**, **Utils**, **Types**, and **Constants**:

```
Types & Constants
  ↓
Utils
  ↓
Services
  ↓
Hooks
  ↓
Components (UI layer)
```

**Dependency Rules:**
- ✅ Components can import from Hooks, Services, Utils, Types, Constants
- ❌ Components should not import from other Components (prefer composition)
- ✅ Components use React hooks (useState, useEffect, custom hooks)

