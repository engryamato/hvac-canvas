/**
 * TabBar Component
 * 
 * Tab navigation for the Line Properties Modal.
 * Three tabs: Properties, Calculations, Advanced.
 */

import React from 'react';

/**
 * Tab identifier type
 */
export type ModalTab = 'properties' | 'calculations' | 'advanced';

/**
 * Props for TabBar component
 */
export interface TabBarProps {
  /** Currently active tab */
  activeTab: ModalTab;
  /** Tab change handler */
  onTabChange: (tab: ModalTab) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Tab configuration
 */
interface TabConfig {
  id: ModalTab;
  label: string;
}

/**
 * Available tabs
 */
const TABS: TabConfig[] = [
  { id: 'properties', label: 'Properties' },
  { id: 'calculations', label: 'Calculations' },
  { id: 'advanced', label: 'Advanced' },
];

/**
 * TabBar Component
 * 
 * Displays three equal-width tabs for modal navigation.
 * 
 * Features:
 * - Three tabs: Properties, Calculations, Advanced
 * - Equal width (~73px each for 220px total)
 * - 36px height
 * - 2px gap between tabs
 * - Active tab: blue bg (#2563eb), white text, 2px bottom border
 * - Inactive tab: transparent bg, gray text (#6b7280)
 * - Hover on inactive: light gray bg
 * - 13px font size, medium weight
 * - Keyboard navigation (Arrow Left/Right)
 * - Accessible with role='tablist' and role='tab'
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <TabBar
 *   activeTab="properties"
 *   onTabChange={(tab) => setActiveTab(tab)}
 * />
 * ```
 */
export function TabBar(props: TabBarProps): JSX.Element {
  const { activeTab, onTabChange, className = '' } = props;

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent, currentTab: ModalTab) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === currentTab);

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
      onTabChange(TABS[prevIndex].id);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
      onTabChange(TABS[nextIndex].id);
    }
  };

  return (
    <div
      className={`flex gap-1 h-9 border-b border-neutral-200 ${className}`}
      role="tablist"
      aria-label="Modal tabs"
      aria-orientation="horizontal"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={[
              'flex-1 text-[13px] font-medium transition-colors duration-150 ease-in-out',
              isActive
                ? 'text-neutral-900 font-semibold border-b-2 border-blue-600'
                : 'text-neutral-500 hover:text-neutral-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

