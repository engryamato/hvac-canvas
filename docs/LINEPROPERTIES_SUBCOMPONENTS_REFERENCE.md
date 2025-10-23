# LinePropertiesModal Sub-Components Reference

**Generated:** 2025-10-19  
**Purpose:** Detailed reference for all LinePropertiesModal sub-components  
**Status:** Addresses HIGH priority gaps from completeness audit

---

## Component Hierarchy

```
LinePropertiesModal (main container)
├── ModalHeader
├── TabBar (Properties | Calculations | Advanced)
├── PropertiesTab
│   ├── TypeDropdown
│   ├── WidthDropdown
│   ├── WidthChips
│   ├── LengthDisplay
│   ├── ExpandableSection
│   ├── GaugeDropdown
│   ├── LayerDropdown
│   └── MaterialDropdown
├── CalculationsTab
│   ├── AirflowInput
│   ├── ResultRow
│   ├── ResultsDisplay
│   └── WarningBanner
├── AdvancedTab
│   ├── CustomPropertiesManager
│   ├── CustomProperty
│   ├── MetadataDisplay
│   ├── NotesTextarea
│   ├── TagChip
│   └── TagsManager
├── MultiSelect (conditional)
│   ├── MultiSelectHeader
│   ├── MultiSelectWarning
│   ├── AggregateStats
│   ├── ApplyToAllCheckbox
│   ├── MixedValueDropdown
│   └── MultiSelectFooter
├── Shared Components (used throughout)
│   ├── Button
│   ├── Chip
│   ├── ColorIndicator
│   ├── Dropdown
│   ├── HelperText
│   ├── Input
│   ├── Label
│   ├── Section
│   ├── Separator
│   └── StatusIcon
└── ModalFooter
```

---

## PropertiesTab Sub-Components

### TypeDropdown
- **File:** `src/components/LinePropertiesModal/PropertiesTab/TypeDropdown.tsx`
- **Purpose:** Select duct type (supply/return/exhaust)
- **Props:** `value: string`, `onChange: (type: string) => void`, `disabled?: boolean`
- **Styling:** Shared Dropdown component with icon

### WidthDropdown
- **File:** `src/components/LinePropertiesModal/PropertiesTab/WidthDropdown.tsx`
- **Purpose:** Select duct width from predefined options
- **Props:** `value: number`, `onChange: (width: number) => void`, `options: number[]`
- **Styling:** Shared Dropdown with width preview

### WidthChips
- **File:** `src/components/LinePropertiesModal/PropertiesTab/WidthChips.tsx`
- **Purpose:** Quick-select width chips
- **Props:** `value: number`, `onChange: (width: number) => void`, `options: number[]`
- **Styling:** Chip components with selection state

### LengthDisplay
- **File:** `src/components/LinePropertiesModal/PropertiesTab/LengthDisplay.tsx`
- **Purpose:** Display calculated line length
- **Props:** `length: number`, `scale: Scale`, `unit: string`
- **Styling:** Read-only display with unit conversion

### ExpandableSection
- **File:** `src/components/LinePropertiesModal/PropertiesTab/ExpandableSection.tsx`
- **Purpose:** Collapsible section for grouped properties
- **Props:** `title: string`, `expanded: boolean`, `onToggle: () => void`, `children: ReactNode`
- **Styling:** Chevron icon, smooth collapse animation

### GaugeDropdown
- **File:** `src/components/LinePropertiesModal/PropertiesTab/GaugeDropdown.tsx`
- **Purpose:** Select duct gauge/thickness
- **Props:** `value: string`, `onChange: (gauge: string) => void`
- **Styling:** Shared Dropdown with gauge preview

### LayerDropdown
- **File:** `src/components/LinePropertiesModal/PropertiesTab/LayerDropdown.tsx`
- **Purpose:** Select layer/zone assignment
- **Props:** `value: string`, `onChange: (layer: string) => void`, `layers: string[]`
- **Styling:** Shared Dropdown with layer color indicator

### MaterialDropdown
- **File:** `src/components/LinePropertiesModal/PropertiesTab/MaterialDropdown.tsx`
- **Purpose:** Select duct material (galvanized, flex, etc.)
- **Props:** `value: string`, `onChange: (material: string) => void`
- **Styling:** Shared Dropdown with material icon

---

## CalculationsTab Sub-Components

### AirflowInput
- **File:** `src/components/LinePropertiesModal/CalculationsTab/AirflowInput.tsx`
- **Purpose:** Input field for airflow CFM value
- **Props:** `value: number`, `onChange: (cfm: number) => void`, `error?: string`
- **Validation:** Numeric input with range validation
- **Styling:** Shared Input with error state

### ResultRow
- **File:** `src/components/LinePropertiesModal/CalculationsTab/ResultRow.tsx`
- **Purpose:** Display single calculation result
- **Props:** `label: string`, `value: string`, `unit: string`, `status: 'ok'|'warning'|'error'`
- **Styling:** Row layout with status indicator

### ResultsDisplay
- **File:** `src/components/LinePropertiesModal/CalculationsTab/ResultsDisplay.tsx`
- **Purpose:** Container for all calculation results
- **Props:** `results: CalculationResult[]`, `isLoading: boolean`
- **Styling:** Grid layout with result rows

### WarningBanner
- **File:** `src/components/LinePropertiesModal/CalculationsTab/WarningBanner.tsx`
- **Purpose:** Display calculation warnings/errors
- **Props:** `message: string`, `severity: 'warning'|'error'`, `onDismiss?: () => void`
- **Styling:** Alert banner with icon and dismiss button

---

## AdvancedTab Sub-Components

### CustomPropertiesManager
- **File:** `src/components/LinePropertiesModal/AdvancedTab/CustomPropertiesManager.tsx`
- **Purpose:** Manage custom properties collection
- **Props:** `properties: CustomProperty[]`, `onChange: (props: CustomProperty[]) => void`
- **Features:** Add/remove/edit custom properties

### CustomProperty
- **File:** `src/components/LinePropertiesModal/AdvancedTab/CustomProperty.tsx`
- **Purpose:** Single custom property editor
- **Props:** `property: CustomProperty`, `onChange: (prop: CustomProperty) => void`, `onRemove: () => void`
- **Styling:** Input fields for key/value pairs

### MetadataDisplay
- **File:** `src/components/LinePropertiesModal/AdvancedTab/MetadataDisplay.tsx`
- **Purpose:** Display line metadata (ID, created, modified)
- **Props:** `metadata: LineMetadata`
- **Styling:** Read-only display with copy buttons

### NotesTextarea
- **File:** `src/components/LinePropertiesModal/AdvancedTab/NotesTextarea.tsx`
- **Purpose:** Multi-line notes editor
- **Props:** `value: string`, `onChange: (notes: string) => void`, `maxLength?: number`
- **Styling:** Textarea with character counter

### TagChip
- **File:** `src/components/LinePropertiesModal/AdvancedTab/TagChip.tsx`
- **Purpose:** Display single tag with remove button
- **Props:** `tag: string`, `onRemove: () => void`
- **Styling:** Chip with close icon

### TagsManager
- **File:** `src/components/LinePropertiesModal/AdvancedTab/TagsManager.tsx`
- **Purpose:** Manage tags collection
- **Props:** `tags: string[]`, `onChange: (tags: string[]) => void`, `suggestions?: string[]`
- **Features:** Add/remove tags, autocomplete suggestions

---

## Shared Components

### Button
- **File:** `src/components/LinePropertiesModal/shared/Button.tsx`
- **Purpose:** Reusable button component
- **Props:** `variant: 'primary'|'secondary'|'danger'`, `size: 'sm'|'md'|'lg'`, `disabled?: boolean`
- **Styling:** Consistent button styling across modal

### Chip
- **File:** `src/components/LinePropertiesModal/shared/Chip.tsx`
- **Purpose:** Reusable chip/badge component
- **Props:** `label: string`, `onRemove?: () => void`, `variant?: 'default'|'selected'`
- **Styling:** Compact chip with optional close button

### ColorIndicator
- **File:** `src/components/LinePropertiesModal/shared/ColorIndicator.tsx`
- **Purpose:** Display color swatch
- **Props:** `color: string`, `size?: 'sm'|'md'|'lg'`
- **Styling:** Circular color preview

### Dropdown
- **File:** `src/components/LinePropertiesModal/shared/Dropdown.tsx`
- **Purpose:** Reusable dropdown/select component
- **Props:** `value: string`, `onChange: (value: string) => void`, `options: Option[]`, `disabled?: boolean`
- **Styling:** Consistent dropdown styling

### HelperText
- **File:** `src/components/LinePropertiesModal/shared/HelperText.tsx`
- **Purpose:** Display helper/hint text
- **Props:** `text: string`, `type?: 'info'|'warning'|'error'`
- **Styling:** Small text with icon

### Input
- **File:** `src/components/LinePropertiesModal/shared/Input.tsx`
- **Purpose:** Reusable input field
- **Props:** `value: string`, `onChange: (value: string) => void`, `type?: 'text'|'number'`, `error?: string`
- **Styling:** Consistent input styling

### Label
- **File:** `src/components/LinePropertiesModal/shared/Label.tsx`
- **Purpose:** Form field label
- **Props:** `text: string`, `required?: boolean`, `htmlFor?: string`
- **Styling:** Consistent label styling

### Section
- **File:** `src/components/LinePropertiesModal/shared/Section.tsx`
- **Purpose:** Grouped section container
- **Props:** `title?: string`, `children: ReactNode`
- **Styling:** Section with padding and border

### Separator
- **File:** `src/components/LinePropertiesModal/shared/Separator.tsx`
- **Purpose:** Visual separator line
- **Props:** `variant?: 'horizontal'|'vertical'`
- **Styling:** Thin line divider

### StatusIcon
- **File:** `src/components/LinePropertiesModal/shared/StatusIcon.tsx`
- **Purpose:** Display status indicator icon
- **Props:** `status: 'success'|'warning'|'error'|'info'`, `size?: 'sm'|'md'|'lg'`
- **Styling:** Colored icon with status meaning

---

## MultiSelect Components

### AggregateStats
- **File:** `src/components/LinePropertiesModal/MultiSelect/AggregateStats.tsx`
- **Purpose:** Display statistics for selected lines
- **Props:** `stats: AggregateStatistics`
- **Displays:** Count, total length, width distribution

### ApplyToAllCheckbox
- **File:** `src/components/LinePropertiesModal/MultiSelect/ApplyToAllCheckbox.tsx`
- **Purpose:** Toggle to apply changes to all selected lines
- **Props:** `checked: boolean`, `onChange: (checked: boolean) => void`
- **Styling:** Checkbox with label

### MixedValueDropdown
- **File:** `src/components/LinePropertiesModal/MultiSelect/MixedValueDropdown.tsx`
- **Purpose:** Dropdown showing mixed values for multi-select
- **Props:** `values: string[]`, `onChange: (value: string) => void`
- **Display:** Shows "Mixed" when values differ

---

## Integration Notes

All sub-components:
- Use **Tailwind CSS** for styling
- Follow **neumorphism design** (current) or **glassmorphism** (target)
- Export **TypeScript interfaces** for props
- Include **JSDoc comments** for documentation
- Are tested in `__tests__/` subdirectories
- Use **barrel exports** (`index.ts`) for clean imports

---

## Next Steps

1. Review each sub-component implementation
2. Verify props interfaces match documentation
3. Update styling for glassmorphism theme
4. Ensure accessibility (ARIA labels, keyboard navigation)
5. Add/update tests for each sub-component

