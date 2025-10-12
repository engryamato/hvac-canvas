/**
 * PropertiesTab Component
 * 
 * Main Properties tab component that assembles all property editing controls.
 * Handles collapsed (280px) and expanded (480px) states.
 */

import React from 'react';
import type { Line } from '../../../types/drawing.types';
import type { DuctType, Material, Gauge } from '../../../types/duct.types';
import { TypeDropdown } from './TypeDropdown';
import { WidthDropdown } from './WidthDropdown';
import { WidthChips } from './WidthChips';
import { LengthDisplay } from './LengthDisplay';
import { ExpandableSection } from './ExpandableSection';
import { LayerDropdown } from './LayerDropdown';
import { MaterialDropdown } from './MaterialDropdown';
import { GaugeDropdown } from './GaugeDropdown';

/**
 * Props for PropertiesTab component
 */
export interface PropertiesTabProps {
  /** Line being edited */
  line: Line;
  /** Update handler for line properties */
  onUpdate: (updates: Partial<Line>) => void;
  /** Whether expandable section is expanded */
  expanded: boolean;
  /** Toggle handler for expandable section */
  onToggleExpand: () => void;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * PropertiesTab Component
 * 
 * The main Properties tab that displays all duct property controls.
 * 
 * Features:
 * - **Collapsed view (280px)**: Type, Width (with quick chips), Length
 * - **Expanded view (480px)**: + Layer, Material, Gauge
 * - Smooth expand/collapse animation (300ms)
 * - Uses all specialized dropdown components
 * - Width quick-select chips for common sizes
 * - Read-only length display
 * - Proper spacing and layout per wireframes
 * 
 * Layout:
 * ```
 * ┌─────────────────────┐
 * │ Type      [Supply ▾]│
 * │ Width     [8"    ▾]│
 * │ [6"][8"][10"][12"]  │
 * │ Length    4.3"      │
 * │                     │
 * │ [More Details ▾]    │  ← Collapsed (280px)
 * └─────────────────────┘
 * 
 * ┌─────────────────────┐
 * │ Type      [Supply ▾]│
 * │ Width     [8"    ▾]│
 * │ [6"][8"][10"][12"]  │
 * │ Length    4.3"      │
 * │                     │
 * │ Layer     [Default▾]│
 * │ Material  [Galv. ▾]│
 * │ Gauge     [26 ga ▾]│
 * │ (0.019" thick)      │
 * │                     │
 * │ [Less Details ▴]    │  ← Expanded (480px)
 * └─────────────────────┘
 * ```
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <PropertiesTab
 *   line={selectedLine}
 *   onUpdate={(updates) => updateLineProperties(selectedLine, updates)}
 *   expanded={isExpanded}
 *   onToggleExpand={() => setIsExpanded(!isExpanded)}
 * />
 * ```
 */
export function PropertiesTab(props: PropertiesTabProps): JSX.Element {
  const {
    line,
    onUpdate,
    expanded,
    onToggleExpand,
    disabled = false,
    className = '',
  } = props;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Type Dropdown */}
      <TypeDropdown
        value={line.type}
        onChange={(type: DuctType) => onUpdate({ type })}
        disabled={disabled}
      />

      {/* Width Dropdown */}
      <WidthDropdown
        value={line.width}
        onChange={(width: number) => onUpdate({ width })}
        disabled={disabled}
      />

      {/* Width Quick-Select Chips */}
      <WidthChips
        currentWidth={line.width}
        onWidthChange={(width: number) => onUpdate({ width })}
        disabled={disabled}
      />

      {/* Length Display (Read-only) */}
      <LengthDisplay line={line} />

      {/* Expandable Section with Additional Properties */}
      <ExpandableSection expanded={expanded} onToggle={onToggleExpand}>
        {/* Layer Dropdown */}
        <LayerDropdown
          value={line.layer}
          onChange={(layer: string) => onUpdate({ layer })}
          disabled={disabled}
        />

        {/* Material Dropdown */}
        <MaterialDropdown
          value={line.material}
          onChange={(material: Material) => onUpdate({ material })}
          disabled={disabled}
        />

        {/* Gauge Dropdown with Thickness Helper */}
        <GaugeDropdown
          value={line.gauge}
          onChange={(gauge: Gauge) => onUpdate({ gauge })}
          disabled={disabled}
        />
      </ExpandableSection>
    </div>
  );
}

