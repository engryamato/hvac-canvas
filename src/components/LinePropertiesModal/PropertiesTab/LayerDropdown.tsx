/**
 * LayerDropdown Component
 * 
 * Dropdown for selecting the layer assignment of a duct line.
 * Uses predefined layers from LAYERS constant.
 */

import React from 'react';
import { Dropdown } from '../shared';
import type { DropdownOption } from '../shared';
import { LAYERS } from '../../../constants/duct.constants';

/**
 * Props for LayerDropdown component
 */
export interface LayerDropdownProps {
  /** Current layer value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * LayerDropdown Component
 * 
 * A specialized dropdown for selecting duct layer assignment.
 * 
 * Features:
 * - Predefined layers: Default, Supply, Return, Exhaust, Fresh Air
 * - Uses LAYERS constant for options
 * - Uses shared Dropdown component
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <LayerDropdown
 *   value={line.layer}
 *   onChange={(layer) => updateLine({ layer })}
 * />
 * ```
 */
export function LayerDropdown(props: LayerDropdownProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  // Build options from LAYERS constant
  const options: DropdownOption<string>[] = LAYERS.map((layer) => ({
    label: layer.label,
    value: layer.value,
  }));

  return (
    <Dropdown<string>
      value={value}
      options={options}
      onChange={onChange}
      label="Layer"
      disabled={disabled}
      className={className}
      ariaLabel="Layer selector"
    />
  );
}

