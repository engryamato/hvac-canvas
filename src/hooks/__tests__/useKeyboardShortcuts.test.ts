/**
 * useKeyboardShortcuts Hook tests
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('should call onToggleDrawMode when D key is pressed', () => {
    const onToggleDrawMode = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onToggleDrawMode },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'd' });
    window.dispatchEvent(event);
    
    expect(onToggleDrawMode).toHaveBeenCalledTimes(1);
  });

  it('should call onCancelDrawing when Escape is pressed while drawing', () => {
    const onCancelDrawing = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onCancelDrawing },
        isDrawing: true,
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);
    
    expect(onCancelDrawing).toHaveBeenCalledTimes(1);
  });

  it('should not call onCancelDrawing when Escape is pressed while not drawing', () => {
    const onCancelDrawing = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onCancelDrawing },
        isDrawing: false,
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);
    
    expect(onCancelDrawing).not.toHaveBeenCalled();
  });

  it('should call onDeleteSelected when Delete is pressed with selection', () => {
    const onDeleteSelected = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onDeleteSelected },
        hasSelection: true,
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(event);
    
    expect(onDeleteSelected).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteSelected when Backspace is pressed with selection', () => {
    const onDeleteSelected = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onDeleteSelected },
        hasSelection: true,
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    window.dispatchEvent(event);
    
    expect(onDeleteSelected).toHaveBeenCalledTimes(1);
  });

  it('should not call onDeleteSelected when Delete is pressed without selection', () => {
    const onDeleteSelected = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onDeleteSelected },
        hasSelection: false,
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(event);
    
    expect(onDeleteSelected).not.toHaveBeenCalled();
  });

  it('should call onIncreaseWidth when ] is pressed', () => {
    const onIncreaseWidth = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onIncreaseWidth },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: ']' });
    window.dispatchEvent(event);
    
    expect(onIncreaseWidth).toHaveBeenCalledTimes(1);
  });

  it('should call onDecreaseWidth when [ is pressed', () => {
    const onDecreaseWidth = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onDecreaseWidth },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: '[' });
    window.dispatchEvent(event);
    
    expect(onDecreaseWidth).toHaveBeenCalledTimes(1);
  });

  it('should call onZoomIn when + is pressed', () => {
    const onZoomIn = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onZoomIn },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: '+' });
    window.dispatchEvent(event);
    
    expect(onZoomIn).toHaveBeenCalledTimes(1);
  });

  it('should call onZoomOut when - is pressed', () => {
    const onZoomOut = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onZoomOut },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: '-' });
    window.dispatchEvent(event);
    
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it('should call onResetZoom when 0 is pressed', () => {
    const onResetZoom = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onResetZoom },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: '0' });
    window.dispatchEvent(event);
    
    expect(onResetZoom).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listener on unmount', () => {
    const onToggleDrawMode = vi.fn();
    
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onToggleDrawMode },
      })
    );
    
    unmount();
    
    const event = new KeyboardEvent('keydown', { key: 'd' });
    window.dispatchEvent(event);
    
    expect(onToggleDrawMode).not.toHaveBeenCalled();
  });

  it('should handle uppercase D key', () => {
    const onToggleDrawMode = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onToggleDrawMode },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: 'D' });
    window.dispatchEvent(event);
    
    expect(onToggleDrawMode).toHaveBeenCalledTimes(1);
  });

  it('should handle = key as zoom in', () => {
    const onZoomIn = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts({
        handlers: { onZoomIn },
      })
    );
    
    const event = new KeyboardEvent('keydown', { key: '=' });
    window.dispatchEvent(event);
    
    expect(onZoomIn).toHaveBeenCalledTimes(1);
  });
});

