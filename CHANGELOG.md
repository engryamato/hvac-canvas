# Changelog

All notable changes to the HVAC Drawing Tool project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-07

### Added - Phase A: Foundation
- **Click-Click Drawing**: CAD-style two-click drawing interaction
  - First click sets start point
  - Mouse move shows live preview with dashed line
  - Second click completes the line
  - Escape key cancels current drawing
- **Line Deletion**: Multiple ways to delete lines
  - Delete button in width HUD
  - Delete/Backspace keyboard shortcuts
  - Automatic table updates after deletion
- **Snap-to-Line**: Intelligent magnetization system
  - Snap to endpoints (20px threshold, highest priority)
  - Snap to midpoints (18px threshold, medium priority)
  - Snap to any point on line (15px threshold, base priority)
  - Visual feedback with cyan dot indicator

### Added - Phase B: Measurements
- **Scale Management System**
  - Default 1:1 scale (1 pixel = 1 inch)
  - 20 predefined scales across 3 categories:
    - Architectural: 6 scales (1/16"=1'-0" to 1"=1'-0")
    - Engineering: 6 scales (1"=10' to 1"=60')
    - Metric: 8 scales (1:1 to 1:500)
- **Unit Conversion**
  - `pixelsToInches()` function for accurate conversion
  - `formatLength()` function for display formatting
  - Imperial formatting: feet-inches (e.g., "16'-8\"")
  - Metric formatting: meters/centimeters (e.g., "5.2 m")
- **Scale Display**
  - Current scale shown in sidebar header
  - Real-time updates when scale changes

### Added - Phase C: UI Enhancement
- **Collapsible Sidebar**
  - 320px width when expanded
  - Full-height toggle button (24px wide)
  - Smooth collapse/expand animation
  - Canvas auto-resizes to fill available space
  - Chevron icons indicate state (left/right)
- **Line Summary Table**
  - Three columns: Count | Size | Total Length
  - Automatic grouping by line width
  - Sorted by width (ascending)
  - Real-time updates on add/delete/modify
  - Professional styling with hover effects
  - Empty state: "No lines drawn yet"
- **Responsive Layout**
  - Flex-based layout (canvas + sidebar)
  - Canvas takes remaining space (flex-1)
  - FAB button position adjusts with sidebar
  - Maintains drawing scale during resize

### Added - Phase D: Quality Assurance
- **Comprehensive Test Suite**
  - 17 Playwright test cases
  - Tests for all major features:
    - Click-click drawing interaction
    - Sidebar collapse/expand
    - Table calculations and updates
    - Line deletion (button + keyboard)
    - Keyboard shortcuts
    - Scale management
    - Visual regression
- **Test Infrastructure**
  - Playwright configuration
  - Test scripts in package.json
  - Screenshot on failure
  - Trace on retry
  - HTML reporter

### Added - Documentation
- **README.md**: Comprehensive user documentation
  - Quick start guide
  - Feature descriptions
  - Keyboard shortcuts reference
  - Troubleshooting section
  - Use cases and best practices
- **PROJECT_SUMMARY.md**: Technical documentation
  - Architecture overview
  - Implementation details
  - Success metrics
  - Future enhancement ideas
- **CHANGELOG.md**: This file

### Technical Details
- **React 18.2** with TypeScript 5.1
- **Vite 5.0** for build tooling
- **Canvas API** for drawing
- **Playwright** for testing
- **Lucide React** for icons
- **Custom CSS utilities** for styling

### Performance
- Optimized snap detection algorithm
- Memoized table calculations with `useMemo`
- Efficient re-rendering strategy
- Smooth 60fps drawing experience
- HiDPI support for sharp rendering

### Accessibility
- Keyboard shortcuts for all major actions
- ARIA labels on interactive elements
- Focus management
- Screen reader friendly

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Tested on desktop only (tablets/laptops supported)

---

## [Unreleased]

### Planned Features
- Scale selector UI (modal/dropdown)
- Custom scale setter (reference line + input)
- Export/Import drawings (JSON format)
- Undo/Redo functionality
- Line colors for different duct types
- Measurements displayed on lines
- Grid and snap-to-grid
- Layer management
- Dark mode theme
- Mobile/touch support

---

## Version History

- **1.0.0** (2025-10-07) - Initial release with all core features
  - Click-click drawing
  - Snap-to-line
  - Collapsible sidebar
  - Line summary table
  - Scale management
  - Comprehensive tests
  - Full documentation

---

## Contributors

- Development Team
- Testing Team
- Documentation Team

---

## License

This project is private and proprietary.

---

**For detailed technical information, see PROJECT_SUMMARY.md**  
**For user documentation, see README.md**

