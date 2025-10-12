/**
 * Section Component
 * 
 * Container component for grouping related content with a title and optional icon.
 * Provides consistent spacing and styling across modal tabs.
 */

import React from 'react';

/**
 * Props for Section component
 */
export interface SectionProps {
  /** Section title */
  title: string;
  /** Optional icon to display before title */
  icon?: React.ReactNode;
  /** Section content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Section Component
 * 
 * A container for grouping related form elements or content.
 * 
 * Features:
 * - 12px medium font title
 * - Gray text color (#6b7280)
 * - 16px gap from previous section
 * - Optional icon support
 * - Consistent spacing for children
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <Section title="Duct Properties">
 *   <TypeDropdown ... />
 *   <WidthDropdown ... />
 * </Section>
 * 
 * <Section title="Results" icon={<Zap size={12} />}>
 *   <ResultsDisplay ... />
 * </Section>
 * ```
 */
export function Section(props: SectionProps): JSX.Element {
  const { title, icon, children, className = '' } = props;

  return (
    <div className={`mt-4 first:mt-0 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-1.5 mb-3">
        {icon && (
          <span className="text-neutral-600 flex-shrink-0">
            {icon}
          </span>
        )}
        <h3 className="text-xs font-medium text-neutral-600">
          {title}
        </h3>
      </div>

      {/* Section Content */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

