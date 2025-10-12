/**
 * MaterialDropdown Component
 * 
 * Dropdown for selecting duct material.
 * Uses predefined materials from MATERIALS constant.
 */

import React from 'react';
import { Dropdown } from '../shared';
import type { DropdownOption } from '../shared';
import type { Material } from '../../../types/duct.types';
import { MATERIALS } from '../../../constants/duct.constants';

/**
 * Props for MaterialDropdown component
 */
export interface MaterialDropdownProps {
  /** Current material value */
  value: Material;
  /** Change handler */
  onChange: (value: Material) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * MaterialDropdown Component
 * 
 * A specialized dropdown for selecting duct material.
 * 
 * Features:
 * - Predefined materials: Galvanized Steel, Stainless Steel, Aluminum, Fiberglass, Flex Duct
 * - Uses MATERIALS constant for options
 * - Uses shared Dropdown component
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <MaterialDropdown
 *   value={line.material}
 *   onChange={(material) => updateLine({ material })}
 * />
 * ```
 */
export function MaterialDropdown(props: MaterialDropdownProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  // Build options from MATERIALS constant
  const options: DropdownOption<Material>[] = MATERIALS.map((material) => ({
    label: material.label,
    value: material.value,
  }));

  return (
    <Dropdown<Material>
      value={value}
      options={options}
      onChange={onChange}
      label="Material"
      disabled={disabled}
      className={className}
      ariaLabel="Material selector"
    />
  );
}

