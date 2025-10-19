/**
 * ExpandableSection Component
 * 
 * Collapsible section with smooth animations for showing/hiding additional content.
 * Used in Properties tab to toggle between collapsed and expanded views.
 */

import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../shared';

/**
 * Props for ExpandableSection component
 */
export interface ExpandableSectionProps {
  /** Whether section is expanded */
  expanded: boolean;
  /** Toggle handler */
  onToggle: () => void;
  /** Content to show/hide */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ExpandableSection Component
 * 
 * A collapsible section with smooth expand/collapse animations.
 * 
 * Features:
 * - "More Details" / "Less Details" button (32px height, dashed border)
 * - Smooth 300ms expand/collapse animation (max-height transition)
 * - Content fade: 100ms fade-out at start of collapse, 100ms fade-in at 200ms of expand
 * - Uses CSS transitions for performance
 * - Chevron icon (down when collapsed, up when expanded)
 * - Uses shared Button component with variant='expand'
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <ExpandableSection
 *   expanded={isExpanded}
 *   onToggle={() => setIsExpanded(!isExpanded)}
 * >
 *   <LayerDropdown ... />
 *   <MaterialDropdown ... />
 *   <GaugeDropdown ... />
 * </ExpandableSection>
 * ```
 */
export function ExpandableSection(props: ExpandableSectionProps): JSX.Element {
  const { expanded, onToggle, children, className = '' } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Measure content height when expanded changes
   */
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [children, expanded]);

  /**
   * Handle animation state
   */
  useEffect(() => {
    if (expanded) {
      setIsAnimating(true);
      // Animation completes after 300ms
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      // Animation completes after 300ms
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  const ChevronIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <div className={className}>
      {/* Expandable Content */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: expanded ? `${contentHeight}px` : '0px',
          opacity: expanded ? 1 : 0,
        }}
        aria-hidden={!expanded}
      >
        <div className="space-y-3 pb-3">
          {children}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="expand"
        onClick={onToggle}
        icon={<ChevronIcon className="w-3.5 h-3.5" />}
        fullWidth
        aria-expanded={expanded}
        aria-label={expanded ? 'Show less details' : 'Show more details'}
      >
        {expanded ? 'Less Details' : 'More Details'}
      </Button>
    </div>
  );
}

