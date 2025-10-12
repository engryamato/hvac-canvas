/**
 * TypeDropdown Component
 * 
 * Dropdown for selecting duct type (Supply or Return) with color indicators.
 * Uses the shared Dropdown component with ColorIndicator icons.
 */

import React from 'react';
import { Dropdown, ColorIndicator } from '../shared';
import type { DropdownOption } from '../shared';
import type { DuctType } from '../../../types/duct.types';
import { DUCT_TYPES } from '../../../constants/duct.constants';

/**
 * Props for TypeDropdown component
 */
export interface TypeDropdownProps {
  /** Current selected duct type */
  value: DuctType;
  /** Change handler */
  onChange: (value: DuctType) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * TypeDropdown Component
 * 
 * A specialized dropdown for selecting duct type with visual color indicators.
 * 
 * Features:
 * - Supply option with blue circle indicator (#2563eb)
 * - Return option with red circle indicator (#dc2626)
 * - Uses shared Dropdown component
 * - Color indicators from DUCT_TYPES constant
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <TypeDropdown
 *   value={line.type}
 *   onChange={(type) => updateLine({ type })}
 * />
 * ```
 */
export function TypeDropdown(props: TypeDropdownProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  // Build options from DUCT_TYPES constant
  const options: DropdownOption<DuctType>[] = [
    {
      label: DUCT_TYPES.supply.label,
      value: 'supply',
      icon: <ColorIndicator color={DUCT_TYPES.supply.color} ariaLabel="Supply duct" />,
    },
    {
      label: DUCT_TYPES.return.label,
      value: 'return',
      icon: <ColorIndicator color={DUCT_TYPES.return.color} ariaLabel="Return duct" />,
    },
  ];

  return (
    <Dropdown<DuctType>
      value={value}
      options={options}
      onChange={onChange}
      label="Type"
      disabled={disabled}
      className={className}
      ariaLabel="Duct type selector"
    />
  );
}

