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

  it('should position based on sidebar width', () => {
    const { rerender } = render(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={320}
      />
    );

    const button = screen.getByRole('button');
    expect(button.style.right).toBe('344px'); // 320 + 24

    rerender(
      <DrawButton
        isActive={false}
        onToggle={vi.fn()}
        sidebarWidth={0}
      />
    );

    expect(button.style.right).toBe('24px'); // 0 + 24
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
});

