/**
 * DrawButton Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawButton } from '../DrawButton';

describe('DrawButton', () => {
  it('should render with inactive state', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button', { name: /enable draw tool/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should render with active state', () => {
    render(
      <DrawButton
        isActive={true}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button', { name: /disable draw tool/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should call onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    
    render(
      <DrawButton
        isActive={false}
        onToggle={onToggle}
        sidebarWidth={320}
      />
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should position based on sidebar width - expanded state', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    expect(button.style.right).toBe('344px'); // 320 + 24
  });

  it('should position based on sidebar width - collapsed state', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={24}
      />
    );

    const button = screen.getByRole('button');
    expect(button.style.right).toBe('48px'); // 24 + 24 (toggle button + spacing)
  });

  it('should transition position when sidebar width changes', () => {
    const { rerender } = render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    expect(button.style.right).toBe('344px'); // 320 + 24
    expect(button.style.transition).toBe('right 300ms ease-in-out');

    rerender(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={24}
      />
    );

    expect(button.style.right).toBe('48px'); // 24 + 24
    expect(button.style.transition).toBe('right 300ms ease-in-out');
  });

  it('should position with proper spacing from bottom bar', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    // Bottom position should be 60px (bottom bar) + 24px (spacing) = 84px
    expect(button.style.bottom).toBe('84px');
  });

  it('should have correct title attribute', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('title')).toBe('Toggle Draw (D)');
  });

  it('should have proper z-index for stacking above other elements', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    expect(button.style.zIndex).toBe('50');
  });

  it('should maintain accessibility during transitions', () => {
    const { rerender } = render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');

    // Check initial accessibility attributes
    expect(button.getAttribute('aria-label')).toBe('Enable Draw tool');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('title')).toBe('Toggle Draw (D)');

    // Rerender with different sidebar width (simulating transition)
    rerender(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={24}
      />
    );

    // Accessibility attributes should remain intact during transition
    expect(button.getAttribute('aria-label')).toBe('Enable Draw tool');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('title')).toBe('Toggle Draw (D)');
  });

  it('should have keyboard focus styles', () => {
    render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');

    // Check that focus-visible classes are present
    expect(button.className).toContain('focus:outline-none');
    expect(button.className).toContain('focus-visible:ring-2');
    expect(button.className).toContain('focus-visible:ring-offset-2');
  });
});

