# PDF Upload Button Feature

**Date:** 2025-10-09  
**Status:** ✅ Completed (UI Ready - Backend Pending)

---

## Overview

Added a PDF upload button to the left side of the bottom bar. The button allows users to select and upload PDF files, with a placeholder handler that will be implemented with full PDF rendering functionality in a future update.

---

## Features

### 1. **Upload Button**

- **Location:** Left side of the bottom bar
- **Icon:** Upload icon from lucide-react
- **Label:** "Upload PDF" text
- **Styling:** Matches the app's design system with neutral colors

### 2. **File Input**

- **Hidden file input** triggered by button click
- **Accepts:** Only PDF files (`application/pdf`)
- **Validation:** Alerts user if non-PDF file is selected
- **Reset:** Input resets after selection to allow re-uploading same file

### 3. **Layout Update**

The bottom bar now uses a **three-column layout**:
- **Left:** PDF Upload button
- **Center:** Zoom controls + Scale selector
- **Right:** Pan instruction text

---

## User Experience

### How to Use

1. **Click** the "Upload PDF" button on the left side of the bottom bar
2. **Select** a PDF file from your file system
3. **Confirmation** appears (currently a placeholder alert)
4. **Future:** PDF will be rendered on the canvas as a background layer

### Visual Design

- **Button Style:** White background with neutral border
- **Hover Effect:** Light gray background on hover
- **Icon + Text:** Upload icon with "Upload PDF" label
- **Responsive:** Maintains layout on different screen sizes

---

## Technical Implementation

### BottomBar Component Updates

#### Props Interface

Added optional `onPdfUpload` callback:

```typescript
export interface BottomBarProps {
  // ... existing props
  /** Callback when PDF file is selected */
  onPdfUpload?: (file: File) => void;
}
```

#### File Input Reference

```typescript
const fileInputRef = useRef<HTMLInputElement>(null);
```

#### Upload Handler

```typescript
const handleUploadClick = () => {
  fileInputRef.current?.click();
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type === 'application/pdf') {
    onPdfUpload?.(file);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } else if (file) {
    alert('Please select a PDF file');
  }
};
```

#### JSX Structure

```tsx
<div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-between px-4">
  {/* Left Side - PDF Upload Button */}
  <div className="flex items-center">
    <input
      ref={fileInputRef}
      type="file"
      accept="application/pdf"
      onChange={handleFileChange}
      className="hidden"
      aria-label="Upload PDF file"
    />
    <button
      type="button"
      onClick={handleUploadClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors text-sm text-neutral-700"
      title="Upload PDF"
    >
      <Upload className="w-4 h-4" />
      <span>Upload PDF</span>
    </button>
  </div>

  {/* Center - Zoom Controls and Scale Selector */}
  <div className="flex items-center gap-4">
    {/* ... zoom controls and scale selector ... */}
  </div>

  {/* Right Side - Pan Instruction */}
  <div className="flex items-center">
    <span className="text-xs text-neutral-500">
      Right-click + drag to pan
    </span>
  </div>
</div>
```

### DrawingCanvas Component Updates

#### PDF Upload Handler

```typescript
const handlePdfUpload = useCallback((file: File) => {
  console.log('PDF uploaded:', file.name);
  // TODO: Implement PDF rendering logic
  alert(`PDF "${file.name}" uploaded successfully!\n\nPDF rendering will be implemented in a future update.`);
}, []);
```

#### BottomBar Props

```tsx
<BottomBar
  zoom={viewportScale}
  canZoomIn={canZoomIn}
  canZoomOut={canZoomOut}
  onZoomIn={handleZoomIn}
  onZoomOut={handleZoomOut}
  currentScale={currentScale}
  scaleOptions={allScaleOptions}
  onScaleChange={setCurrentScale}
  onPdfUpload={handlePdfUpload}
/>
```

---

## Layout Changes

### Before

```
┌─────────────────────────────────────────────────────────┐
│  [Zoom Controls]  [Scale Selector]  Pan instruction     │
└─────────────────────────────────────────────────────────┘
```

### After

```
┌─────────────────────────────────────────────────────────┐
│ [Upload PDF]  [Zoom Controls] [Scale Selector]  Pan...  │
└─────────────────────────────────────────────────────────┘
```

The layout now uses `justify-between` to distribute the three sections evenly across the bottom bar.

---

## Files Modified

1. **`src/components/DrawingCanvas/BottomBar.tsx`**
   - Added `Upload` icon import from lucide-react
   - Added `useRef` for file input
   - Added `onPdfUpload` prop
   - Added file input handlers
   - Updated layout to three-column structure
   - Added hidden file input and upload button

2. **`src/DrawingCanvas.tsx`**
   - Added `handlePdfUpload` callback
   - Passed `onPdfUpload` prop to BottomBar

3. **`docs/PDF_UPLOAD_BUTTON_2025-10-09.md`** (NEW)
   - Complete feature documentation

---

## Testing

All existing tests continue to pass:
- ✅ **11 BottomBar tests** pass
- ✅ No breaking changes
- ✅ All functionality preserved

---

## Future Implementation

### PDF Rendering (To Be Implemented)

The current implementation provides the UI and file selection. Future updates will add:

1. **PDF.js Integration**
   - Install `pdfjs-dist` library
   - Configure PDF.js worker

2. **Canvas Layer System**
   - Add PDF background layer
   - Render PDF pages on canvas
   - Scale PDF to match drawing scale

3. **PDF State Management**
   - Store uploaded PDF data
   - Track current page (for multi-page PDFs)
   - Handle PDF zoom/pan with viewport

4. **UI Enhancements**
   - Page navigation controls
   - PDF opacity slider
   - Remove/replace PDF button
   - PDF info display (filename, page count)

5. **Performance Optimization**
   - Lazy load PDF pages
   - Cache rendered pages
   - Optimize memory usage

---

## Benefits

✅ **User-Friendly:** Simple one-click upload process  
✅ **Validation:** Only accepts PDF files  
✅ **Accessible:** Proper ARIA labels and keyboard support  
✅ **Consistent Design:** Matches app's visual style  
✅ **Extensible:** Ready for PDF rendering implementation  
✅ **Non-Intrusive:** Doesn't interfere with existing features  

---

## Summary

The PDF upload button is now live and functional on the left side of the bottom bar. Users can select PDF files, and the system validates the file type. The placeholder handler logs the upload and displays a confirmation message. The full PDF rendering functionality will be implemented in a future update, which will allow users to use PDFs as background references for their HVAC drawings.

**Live at:** http://localhost:5173/

Try it out:
1. Look at the left side of the bottom bar
2. Click the "Upload PDF" button
3. Select a PDF file
4. See the confirmation message! 📄

