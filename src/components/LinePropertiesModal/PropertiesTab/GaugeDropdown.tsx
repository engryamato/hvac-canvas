/**
 * GaugeDropdown Component
 * 
 * Dropdown for selecting sheet metal gauge with thickness information.
 * Shows helper text below dropdown with the thickness in inches.
 */

import React from 'react';
import { Dropdown, HelperText } from '../shared';
import type { DropdownOption } from '../shared';
import type { Gauge } from '../../../types/duct.types';
import { GAUGES } from '../../../constants/duct.constants';

/**
 * Props for GaugeDropdown component
 */
export interface GaugeDropdownProps {
  /** Current gauge value */
  value: Gauge;
  /** Change handler */
  onChange: (value: Gauge) => void;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * GaugeDropdown Component
 * 
 * A specialized dropdown for selecting sheet metal gauge with thickness display.
 * 
 * Features:
 * - Predefined gauges: 26ga, 24ga, 22ga, 20ga, 18ga
 * - Shows thickness helper text below (e.g., "(0.019" thick)")
 * - Uses GAUGES constant for options
 * - Uses shared Dropdown and HelperText components
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <GaugeDropdown
 *   value={line.gauge}
 *   onChange={(gauge) => updateLine({ gauge })}
 * />
 * // Displays: "26 ga" with helper text "(0.019" thick)"
 * ```
 */
export function GaugeDropdown(props: GaugeDropdownProps): JSX.Element {
  const { value, onChange, disabled = false, className = '' } = props;

  // Build options from GAUGES constant
  const options: DropdownOption<Gauge>[] = GAUGES.map((gauge) => ({
    label: gauge.label,
    value: gauge.value,
  }));

  // Find selected gauge to show thickness
  const selectedGauge = GAUGES.find((g) => g.value === value);
  const thicknessText = selectedGauge
    ? `(${selectedGauge.thickness}" thick)`
    : '';

  return (
    <div className={className}>
      <Dropdown<Gauge>
        value={value}
        options={options}
        onChange={onChange}
        label="Gauge"
        disabled={disabled}
        ariaLabel="Sheet metal gauge selector"
      />
      {thicknessText && (
        <HelperText text={thicknessText} className="mt-1" />
      )}
    </div>
  );
}

