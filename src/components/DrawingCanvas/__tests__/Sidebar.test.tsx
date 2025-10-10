/**
 * Sidebar Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../Sidebar';
import type { LineSummaryRow, Scale } from '../../../types';

describe('Sidebar', () => {
  const mockScale: Scale = {
    type: 'architectural',
    pixelsPerInch: 48,
    displayName: '1/4" = 1\'',
    unit: 'imperial'
  };

  const mockLineSummary: LineSummaryRow[] = [
    {
      width: 8,
      widthDisplay: '8"',
      count: 3,
      totalLength: 120.5,
      totalLengthDisplay: '120.5"',
      lineIds: ['line1', 'line2', 'line3']
    },
    {
      width: 12,
      widthDisplay: '12"',
      count: 2,
      totalLength: 85.25,
      totalLengthDisplay: '85.25"',
      lineIds: ['line4', 'line5']
    }
  ];

  it('should render collapsed state', () => {
    render(
      <Sidebar
        collapsed={true}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    // Toggle button should be visible
    const toggleButton = screen.getByRole('button', { name: /expand sidebar/i });
    expect(toggleButton).toBeDefined();
    
    // Sidebar content should not be visible
    expect(screen.queryByText('Line Summary')).toBeNull();
  });

  it('should render expanded state with header', () => {
    render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    // Header should be visible
    expect(screen.getByText('Line Summary')).toBeDefined();
    expect(screen.getByText(/Scale: 1\/4" = 1'/i)).toBeDefined();
    
    // Toggle button should show collapse label
    const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(toggleButton).toBeDefined();
  });

  it('should render empty state when no lines', () => {
    render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    expect(screen.getByText('No lines drawn yet')).toBeDefined();
  });

  it('should render line summary table with data', () => {
    render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={mockLineSummary}
        currentScale={mockScale}
      />
    );
    
    // Table headers
    expect(screen.getByText('Width')).toBeDefined();
    expect(screen.getByText('Count')).toBeDefined();
    expect(screen.getByText('Total Length')).toBeDefined();
    
    // First row data
    expect(screen.getByText('8"')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('120.5"')).toBeDefined();
    
    // Second row data
    expect(screen.getByText('12"')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('85.25"')).toBeDefined();
  });

  it('should call onToggle when toggle button clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Sidebar
        collapsed={false}
        onToggle={onToggle}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i });
    await user.click(toggleButton);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should use custom width when provided', () => {
    const { container } = render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
        width={400}
      />
    );
    
    // Find the sidebar content div
    const sidebarContent = container.querySelector('[style*="width"]');
    expect(sidebarContent?.getAttribute('style')).toContain('400px');
  });

  it('should position toggle button based on sidebar width', () => {
    const { rerender } = render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
        width={320}
      />
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton.style.right).toBe('320px');

    rerender(
      <Sidebar
        collapsed={true}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
        width={320}
      />
    );

    expect(toggleButton.style.right).toBe('0px'); // Collapsed
  });

  it('should not overlap with bottom bar', () => {
    const { container } = render(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
        width={320}
      />
    );

    const toggleButton = screen.getByRole('button');
    const sidebarContent = container.querySelector('.fixed.top-0.right-0');

    // Both toggle button and sidebar content should have height: calc(100vh - 60px)
    expect(toggleButton.style.height).toBe('calc(100vh - 60px)');
    expect(sidebarContent?.getAttribute('style')).toContain('calc(100vh - 60px)');
  });

  it('should render correct icon based on collapsed state', () => {
    const { rerender } = render(
      <Sidebar
        collapsed={true}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    // Collapsed state should show ChevronLeft (expand icon)
    let toggleButton = screen.getByRole('button');
    expect(toggleButton.querySelector('svg')).toBeDefined();
    
    rerender(
      <Sidebar
        collapsed={false}
        onToggle={vi.fn()}
        lineSummary={[]}
        currentScale={mockScale}
      />
    );
    
    // Expanded state should show ChevronRight (collapse icon)
    toggleButton = screen.getByRole('button');
    expect(toggleButton.querySelector('svg')).toBeDefined();
  });
});

