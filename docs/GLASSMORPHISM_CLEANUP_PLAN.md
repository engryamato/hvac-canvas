# Glassmorphism Cleanup Plan

**Date:** 2025-10-19  
**Status:** Ready for Approval  
**Scope:** Remove all glassmorphism references and establish neumorphism as primary design system

---

## Files to Delete

### 1. CSS Files
- **`src/styles/glassmorphism.css`** (252 lines)
  - Contains all glass-tier1, glass-tier2, glass-tier3 utility classes
  - Includes accessibility media queries
  - GPU optimization classes
  - Dark mode support (future)

---

## Code Files to Update

### 1. `src/components/DrawingCanvas/PdfControls.tsx`
**Changes Required:**
- Line 34: Replace `glass-pdf-controls` with neumorphic equivalent
- Line 46: Replace `glass-tier3 glass-tier3-hover` with neumorphic classes

**Current:**
```
className="absolute top-4 left-4 glass-pdf-controls rounded-lg border p-3 z-20 min-w-[280px]"
className="glass-tier3 glass-tier3-hover transition-all"
```

**Replacement:**
```
className="absolute top-4 left-4 neumorphic-raised-md rounded-lg border border-neutral-200 p-3 z-20 min-w-[280px]"
className="neumorphic-raised-sm neumorphic-hover transition-all"
```

---

## Constants to Update

### 1. `src/constants/design-tokens.ts`
**Changes Required:**
- Remove `GLASS_TOKENS` export (lines 459-548)
- Remove `GlassTokens` type definition (lines 551-553)
- Keep `NEUMORPHISM_TOKENS` (lines 585-667)

**Items to Remove:**
- `GLASS_TOKENS.tier1` (background, border, blur, saturate)
- `GLASS_TOKENS.tier2` (background, border, blur, saturate)
- `GLASS_TOKENS.tier3` (background, border, blur, saturate)
- `GLASS_TOKENS.dark` (dark mode variants)
- `GlassTokens` type

---

## Documentation Files to Update

### 1. `docs/ARCHITECTURE_INVENTORY.md`
**Section F: Styling System**

**Current (Lines 213-235):**
```
2. `src/styles/typography.css` - Font sizes, weights, line heights
3. `src/styles/neumorphism.css` - Soft UI shadow effects (CURRENT)
4. `src/styles/glassmorphism.css` - Glass effect utilities (AVAILABLE)

### Design System
- **Current Theme:** Neumorphism (soft UI with dual shadows)
- **Planned Theme:** Glassmorphism (glass effect with blur)
- **Base Color:** #E0E5EC (light gray-blue)
- **Primary Color:** Tech Blue (#3B82F6)

### Neumorphism Classes (Current)
- `.neumorphic-raised-sm` - Subtle raised effect
- `.neumorphic-raised-md` - Medium raised effect
- `.neumorphic-raised-lg` - Strong raised effect
- `.neumorphic-hover` - Hover state
- `.neumorphic-active` - Inverted shadows when pressed

### Glassmorphism Classes (Available)
- `.glass-tier1` - Primary UI (Sidebar, Bottom Bar)
- `.glass-tier2` - Floating elements (Modals)
- `.glass-tier3` - Interactive controls (Buttons)
- `.glass-pdf-controls` - PDF overlay controls
```

**Replacement:**
```
2. `src/styles/typography.css` - Font sizes, weights, line heights
3. `src/styles/neumorphism.css` - Soft UI shadow effects (PRIMARY)

### Design System
- **Theme:** Neumorphism (soft UI with dual shadows)
- **Base Color:** #E0E5EC (light gray-blue)
- **Primary Color:** Tech Blue (#3B82F6)

### Neumorphism Classes
- `.neumorphic-raised-sm` - Subtle raised effect
- `.neumorphic-raised-md` - Medium raised effect
- `.neumorphic-raised-lg` - Strong raised effect
- `.neumorphic-hover` - Hover state
- `.neumorphic-active` - Inverted shadows when pressed
```

### 2. `docs/COMPONENT_REFERENCE.md`
**Update LinePropertiesModal description (Line 94):**

**Current:**
```
- **Styling:** Glassmorphism tier2, neumorphic controls
```

**Replacement:**
```
- **Styling:** Neumorphic (raised effect with dual shadows)
```

**Remove Glassmorphism section (Lines 344-348):**
```
### Glassmorphism (Available)
- `.glass-tier1` - Primary UI
- `.glass-tier2` - Floating elements
- `.glass-tier3` - Interactive controls
- `.glass-pdf-controls` - PDF overlay
```

### 3. `docs/INVENTORY_SUMMARY.md`
**Remove glassmorphism task (Lines 209-214):**
```
### Task: Implement glassmorphism theme
1. See: `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md`
2. Update: `src/main.tsx` (import glassmorphism.css)
3. Replace: Neumorphism classes with glass classes
4. Test: Accessibility features (reduced motion, contrast, transparency)
5. Verify: Browser support and fallbacks
```

### 4. `docs/AUDIT_SUMMARY_AND_NEXT_STEPS.md`
**Remove glassmorphism references:**
- Remove from "Impact on Glassmorphism Implementation" section
- Update "Ready to Proceed" section to remove glassmorphism mentions
- Update "Next Step" to remove glassmorphism implementation

### 5. `docs/AUDIT_COMPLETION_SUMMARY.md`
**Remove glassmorphism references:**
- Update "Impact on Glassmorphism Implementation" section
- Remove from "Conclusion" section

---

## Files NOT Requiring Changes

### Documentation (Keep as historical reference)
- `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md` - Historical reference
- `docs/GLASSMORPHISM_IMPLEMENTATION_SUMMARY.md` - Historical reference
- `docs/NEUMORPHISM_IMPLEMENTATION_COMPLETE.md` - Historical reference

### Code (Already correct)
- `src/main.tsx` - Glassmorphism import already commented out
- `src/constants/design-tokens.ts` - Neumorphism tokens already in place
- All component files - Already using neumorphic classes

---

## Summary of Changes

| Category | Action | Count |
|----------|--------|-------|
| Files to Delete | Remove glassmorphism.css | 1 |
| Code Files to Update | Update PdfControls.tsx | 1 |
| Constants to Update | Remove GLASS_TOKENS | 1 |
| Documentation to Update | Update 5 files | 5 |
| Total Changes | | 8 |

---

## Verification Steps

After cleanup:
1. ✅ Verify `src/styles/glassmorphism.css` is deleted
2. ✅ Verify no `glass-` classes in codebase
3. ✅ Verify `GLASS_TOKENS` removed from design-tokens.ts
4. ✅ Verify PdfControls uses neumorphic classes
5. ✅ Verify all documentation updated
6. ✅ Run build to ensure no import errors
7. ✅ Run tests to ensure no regressions

---

## Approval Checklist

- [ ] Approve deletion of `src/styles/glassmorphism.css`
- [ ] Approve removal of `GLASS_TOKENS` from design-tokens.ts
- [ ] Approve updates to PdfControls.tsx
- [ ] Approve documentation updates (5 files)
- [ ] Ready to proceed with cleanup

---

## Next Steps After Cleanup

1. Run build: `npm run build`
2. Run tests: `npm run test`
3. Verify no console errors
4. Commit changes with message: "chore: remove glassmorphism, establish neumorphism as primary design system"

