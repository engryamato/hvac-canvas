/**
 * Shared Components Barrel Export
 * 
 * Re-exports all shared UI components used across the Line Properties Modal.
 * These components provide consistent styling and behavior throughout the modal.
 * 
 * Usage: import { Dropdown, Button, Input } from '@/components/LinePropertiesModal/shared';
 */

// Form components
export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption } from './Dropdown';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';

export { Input } from './Input';
export type { InputProps, InputType, ValidationState } from './Input';

export { Chip } from './Chip';
export type { ChipProps, ChipSize } from './Chip';

// Text components
export { Label } from './Label';
export type { LabelProps } from './Label';

export { HelperText } from './HelperText';
export type { HelperTextProps, HelperTextVariant } from './HelperText';

// Visual components
export { StatusIcon } from './StatusIcon';
export type { StatusIconProps, StatusType } from './StatusIcon';

export { ColorIndicator } from './ColorIndicator';
export type { ColorIndicatorProps } from './ColorIndicator';

// Layout components
export { Section } from './Section';
export type { SectionProps } from './Section';

export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';

