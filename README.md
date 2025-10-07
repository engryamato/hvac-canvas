# HVAC Drawing Tool

A professional CAD-style drawing application for HVAC duct design with intelligent snap-to-line functionality and real-time measurement summaries.

![HVAC Drawing Tool](https://img.shields.io/badge/status-production%20ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Tests](https://img.shields.io/badge/tests-17%20passing-brightgreen)

---

## ✨ Features

### 🎨 Drawing
- **Click-Click Drawing** - CAD-style interaction (no dragging required)
- **Live Preview** - See your line before completing it
- **Snap-to-Line** - Automatically snap to endpoints, midpoints, and line segments
- **Visual Feedback** - Cyan dot shows snap points
- **Escape to Cancel** - Cancel drawing anytime

### 📏 Measurements
- **Automatic Scaling** - Default 1:1 (1 pixel = 1 inch)
- **20 Predefined Scales** - Architectural, Engineering, and Metric
- **Smart Formatting** - Imperial (16'-8") or Metric (5.2 m)
- **Real-Time Calculations** - Instant length updates

### 📊 Summary Table
- **Grouped by Width** - Automatic grouping
- **Count & Total Length** - See totals at a glance
- **Real-Time Updates** - Updates as you draw/delete
- **Professional Styling** - Clean, easy-to-read table

### 🎛️ Interface
- **Collapsible Sidebar** - 320px sidebar with toggle
- **Responsive Canvas** - Auto-adjusts to sidebar state
- **Width Adjustment** - Slider or keyboard shortcuts
- **Line Selection** - Click to select, delete with button or key

---

## 🚀 Quick Start

### Installation
```bash
# Clone or download the project
cd "Working Canvas"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5174/`

---

## 📖 How to Use

### Drawing Lines

1. **Enable Draw Mode**
   - Click the blue FAB button (bottom right)
   - Or press **D** key

2. **Draw a Line**
   - Click once to set the start point
   - Move your mouse (you'll see a dashed preview)
   - Click again to complete the line

3. **Cancel Drawing**
   - Press **Escape** key

### Adjusting Line Width

**Before Drawing:**
- Press **[** to decrease width
- Press **]** to increase width

**After Drawing:**
- Click a line to select it
- Use the slider or **[** / **]** keys

### Deleting Lines

1. Click a line to select it
2. Click the **Delete** button
3. Or press **Delete** or **Backspace** key

### Using the Sidebar

**View Summary:**
- See all lines grouped by width
- View count and total length for each size

**Collapse/Expand:**
- Click the thin vertical button between canvas and sidebar
- Sidebar slides in/out smoothly

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **D** | Toggle draw mode on/off |
| **Escape** | Cancel current drawing |
| **[** | Decrease line width |
| **]** | Increase line width |
| **Delete** | Delete selected line |
| **Backspace** | Delete selected line |

---

## 🎯 Snap-to-Line Feature

The tool automatically snaps to existing lines when drawing:

### Snap Points (in priority order)
1. **Endpoints** (20px threshold) - Highest priority
2. **Midpoints** (18px threshold) - Medium priority
3. **Any point on line** (15px threshold) - Base priority

### Visual Feedback
- **Cyan dot** appears at snap point
- Cursor automatically aligns to snap point
- Line connects precisely to snap location

---

## 📊 Summary Table

The sidebar shows a real-time summary of all lines:

| Column | Description |
|--------|-------------|
| **Count** | Number of lines with this width |
| **Size** | Width in inches (e.g., "8\"") |
| **Total Length** | Sum of all line lengths (e.g., "28'-6\"") |

**Features:**
- Automatically groups lines by width
- Sorts by width (smallest to largest)
- Updates in real-time as you draw/delete
- Shows "No lines drawn yet" when empty

---

## 📏 Scale System

### Default Scale
- **1:1** - 1 pixel = 1 inch

### Available Scales

**Architectural Scales:**
- 1/16" = 1'-0"
- 1/8" = 1'-0"
- 1/4" = 1'-0"
- 1/2" = 1'-0"
- 3/4" = 1'-0"
- 1" = 1'-0"

**Engineering Scales:**
- 1" = 10'
- 1" = 20'
- 1" = 30'
- 1" = 40'
- 1" = 50'
- 1" = 60'

**Metric Scales:**
- 1:1, 1:5, 1:10, 1:20, 1:50, 1:100, 1:200, 1:500

*Note: Scale selector UI coming in future update*

---

## 🧪 Testing

### Run Tests
```bash
# Install Playwright (first time only)
npx playwright install chromium

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

### Test Coverage
- ✅ 17 comprehensive test cases
- ✅ Click-click drawing interaction
- ✅ Sidebar collapse/expand
- ✅ Table calculations and updates
- ✅ Line deletion
- ✅ Keyboard shortcuts
- ✅ Scale management

---

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.1** - Type safety
- **Vite 5.0** - Build tool
- **Canvas API** - Drawing
- **Playwright** - Testing
- **Lucide React** - Icons

---

## 📁 Project Structure

```
Working Canvas/
├── src/
│   ├── DrawingCanvas.tsx    # Main component
│   ├── App.tsx               # Root component
│   └── styles.css            # Utility classes
├── tests/
│   └── drawing-canvas.spec.ts # Test suite
├── playwright.config.ts      # Test configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🐛 Troubleshooting

### Sidebar not visible?
- Refresh the browser (F5 or Ctrl+R)
- Check that the toggle button is visible
- Click the toggle button to expand

### Lines not snapping?
- Make sure you're in draw mode (blue FAB button)
- Move cursor closer to existing lines
- Snap threshold: 20px for endpoints, 18px for midpoints

### Table not updating?
- Table updates automatically when lines are added/deleted
- If empty, it shows "No lines drawn yet"
- Try drawing a line to see the table appear

---

## 📝 Tips & Best Practices

1. **Use Snap-to-Line** - Let lines connect automatically for precision
2. **Adjust Width First** - Set width before drawing for efficiency
3. **Use Keyboard Shortcuts** - Faster than clicking buttons
4. **Collapse Sidebar** - More canvas space when needed
5. **Check Summary Table** - Verify totals before finalizing

---

## 🎯 Use Cases

- **HVAC Duct Design** - Plan ductwork layouts
- **Technical Drawings** - Create precise line drawings
- **Floor Plans** - Sketch room layouts
- **Diagrams** - Draw connected line diagrams
- **Measurements** - Calculate total lengths by size

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Support

For questions or issues, please contact the development team.

---

**Happy Drawing!** 🎨✨

