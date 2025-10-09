# Zoom and Pan Feature - User Guide

## 🎉 New Features

Your HVAC Canvas application now includes professional zoom and pan functionality!

---

## 🖱️ How to Use

### Zooming

#### Mouse Wheel
- **Scroll up** to zoom in
- **Scroll down** to zoom out
- Zoom centers on your cursor position
- Range: 10% to 1000%

#### Keyboard Shortcuts
- Press **`+`** or **`=`** to zoom in
- Press **`-`** or **`_`** to zoom out
- Press **`Ctrl+0`** (Windows) or **`Cmd+0`** (Mac) to reset view to 100%

#### Bottom Bar Controls
Look at the bottom of the screen for the control bar:

```
[−]  [Zoom: 100%] [Reset View]  [+]  Right-click + drag to pan
```

- Click **`−`** button to zoom out
- Click **`+`** button to zoom in
- Click **`Reset View`** button to return to 100% zoom at origin
- The **`Zoom: 100%`** indicator shows your current zoom level

### Panning

#### Right-Click Drag
1. **Right-click** anywhere on the canvas
2. **Hold** the right mouse button
3. **Drag** to pan the view
4. **Release** to stop panning

The cursor will change to a "grabbing" hand during panning.

#### Touch Gestures (Tablets)
- **Two-finger drag** to pan
- **Pinch** with two fingers to zoom in/out
- Zoom centers on the midpoint between your fingers

---

## 🎨 Drawing and Selection (Unchanged)

All your existing features still work exactly the same:

### Drawing Mode
1. Press **`D`** to toggle draw mode
2. Click to set the start point
3. Click to set the end point
4. Lines automatically snap to endpoints and midpoints

### Selection Mode
1. Exit draw mode (press **`D`** again)
2. Click on any line to select it
3. Use the floating HUD to:
   - Adjust line width with **`[`** and **`]`** keys
   - Change width with the number input
   - Delete the line

### Width Adjustment
- **Selected line**: Press **`[`** to decrease, **`]`** to increase
- **Drawing mode**: Press **`[`** to decrease default width, **`]`** to increase

---

## 💡 Tips and Tricks

### Efficient Workflow
1. **Zoom in** to draw precise details
2. **Zoom out** to see the big picture
3. **Pan** to navigate large drawings
4. **Reset view** when you get lost

### Zoom to Cursor
- The zoom always centers on your cursor position
- Point your cursor where you want to zoom in
- This makes it easy to focus on specific areas

### Right-Click Pan
- Right-click pan doesn't interfere with drawing or selection
- You can pan at any zoom level
- The context menu is disabled during pan

### Keyboard Shortcuts Summary
- **`D`** - Toggle draw mode
- **`+`** / **`-`** - Zoom in/out
- **`Ctrl+0`** - Reset view
- **`[`** / **`]`** - Adjust line width
- **`Delete`** or **`Backspace`** - Delete selected line
- **`Escape`** - Cancel current drawing

---

## 🎯 Bottom Bar

The bottom bar is always visible at the bottom of the screen:

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                     Canvas Area                              │
│                  (Drawing and Selection)                     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  [−]  [Zoom: 100%] [Reset View]  [+]  Right-click + drag   │
└─────────────────────────────────────────────────────────────┘
```

### Controls
1. **Zoom Out Button** (−) - Decreases zoom by 10%
2. **Zoom Indicator** - Shows current zoom percentage
3. **Reset View Button** - Returns to 100% zoom at origin
4. **Zoom In Button** (+) - Increases zoom by 10%
5. **Pan Instruction** - Reminder text for right-click pan

---

## 📱 Tablet Support

### Touch Gestures
- **Pinch-to-Zoom**: Use two fingers to pinch in/out
- **Two-Finger Pan**: Drag with two fingers to pan
- **Single Touch**: Still works for drawing and selection

### Optimized for Tablets
- Touch events are optimized for smooth performance
- Zoom centers on the midpoint between your fingers
- No conflicts with drawing or selection

---

## 🔧 Technical Details

### Zoom Range
- **Minimum**: 10% (0.1x)
- **Maximum**: 1000% (10x)
- **Default**: 100% (1x)
- **Increment**: 10% per step

### Performance
- Smooth zoom and pan with up to 100+ lines
- Hardware-accelerated canvas transforms
- Sharp rendering on HiDPI displays (Retina, etc.)

### Coordinate System
- Lines are stored in canvas coordinates
- Viewport transform is applied during rendering
- All existing features work at any zoom level

---

## ❓ Troubleshooting

### Zoom not working?
- Check if you're at min (10%) or max (1000%) zoom
- The zoom buttons will be disabled at limits
- Try using keyboard shortcuts instead

### Pan not working?
- Make sure you're using the **right** mouse button
- Left-click is still for drawing/selection
- Middle-click is not used

### Lost your view?
- Click the **Reset View** button in the bottom bar
- Or press **`Ctrl+0`** (Windows) or **`Cmd+0`** (Mac)
- This returns to 100% zoom at origin

### HUD not visible?
- The HUD may be off-screen if you've panned far
- Reset the view to bring it back
- The HUD automatically avoids the bottom bar

---

## 🎓 Best Practices

### For Large Drawings
1. Start at 100% zoom to get oriented
2. Zoom out to see the entire drawing
3. Zoom in to specific areas for detail work
4. Use pan to navigate between areas

### For Precision Work
1. Zoom in to 200-400% for precise placement
2. Use snap detection for alignment
3. Zoom out to verify overall layout
4. Reset view when switching tasks

### For Presentations
1. Zoom to fit the area of interest
2. Use pan to show different sections
3. Reset view to return to overview
4. Zoom in to highlight specific details

---

## 📚 Additional Resources

### Documentation
- **ZOOM_PAN_FINAL_PLAN.md** - Complete implementation details
- **ZOOM_PAN_COORDINATE_DIAGRAM.md** - Visual diagrams
- **BOTTOM_BAR_MOCKUP.md** - Bottom bar specifications
- **IMPLEMENTATION_COMPLETE.md** - Implementation summary

### Support
- All existing features are preserved
- No breaking changes
- Fully integrated with drawing and selection

---

## 🎉 Enjoy Your Enhanced Canvas!

You now have professional-grade zoom and pan functionality in your HVAC Canvas application. Happy drawing!

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2025-10-09

