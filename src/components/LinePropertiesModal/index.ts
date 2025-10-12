/**
 * LinePropertiesModal Barrel Export
 * 
 * Re-exports the main LinePropertiesModal component and all sub-components.
 * 
 * Usage: import { LinePropertiesModal } from '@/components/LinePropertiesModal';
 */

// Main modal component
export { LinePropertiesModal } from './LinePropertiesModal';
export type { LinePropertiesModalProps } from './LinePropertiesModal';

// Modal structure components
export { ModalHeader } from './ModalHeader';
export type { ModalHeaderProps } from './ModalHeader';

export { TabBar } from './TabBar';
export type { TabBarProps, ModalTab } from './TabBar';

export { ModalFooter } from './ModalFooter';
export type { ModalFooterProps } from './ModalFooter';

// Tab components
export * from './PropertiesTab';
export * from './CalculationsTab';
export * from './AdvancedTab';

// Multi-select components
export * from './MultiSelect';

// Shared components
export * from './shared';

