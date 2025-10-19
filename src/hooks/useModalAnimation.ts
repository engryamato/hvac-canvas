/**
 * useModalAnimation Hook
 * 
 * Custom hook for managing modal open/close animations.
 * Handles fade-in/scale on open and fade-out on close.
 */

import { useState, useEffect } from 'react';
import { ANIMATION_OPEN, ANIMATION_CLOSE } from '../constants/modal.constants';

/**
 * Animation state result
 */
export interface ModalAnimationState {
  /** Whether modal is visible (opacity > 0) */
  isVisible: boolean;
  /** Whether animation is in progress */
  isAnimating: boolean;
  /** CSS class for animation */
  animationClass: string;
  /** Whether modal should be rendered in DOM */
  shouldRender: boolean;
}

/**
 * Props for useModalAnimation hook
 */
export interface UseModalAnimationProps {
  /** Whether modal is open */
  isOpen: boolean;
}

/**
 * useModalAnimation Hook
 * 
 * Manages modal animations with proper timing.
 * 
 * Features:
 * - Open: 200ms fade-in (opacity 0→1) + scale (0.95→1)
 * - Close: 150ms fade-out (opacity 1→0)
 * - Delays DOM removal until animation completes
 * - Returns animation state and CSS class
 * - Uses CSS transitions, not JavaScript animations
 * - Handles edge cases (unmount during animation)
 * 
 * Animation States:
 * - Opening: shouldRender=true, isVisible=false → isVisible=true (triggers CSS transition)
 * - Open: shouldRender=true, isVisible=true, isAnimating=false
 * - Closing: shouldRender=true, isVisible=false (triggers CSS transition)
 * - Closed: shouldRender=false, isVisible=false
 * 
 * @param props - Hook props
 * @returns Animation state
 * 
 * @example
 * ```tsx
 * const animation = useModalAnimation({ isOpen: true });
 * 
 * {animation.shouldRender && (
 *   <div className={animation.animationClass}>
 *     Modal content
 *   </div>
 * )}
 * ```
 */
export function useModalAnimation(props: UseModalAnimationProps): ModalAnimationState {
  const { isOpen } = props;

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Opening animation
      setShouldRender(true);
      setIsAnimating(true);

      // Trigger animation on next frame (after DOM render)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      // Animation complete
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_OPEN);

      return () => clearTimeout(timer);
    } else if (shouldRender) {
      // Closing animation
      setIsVisible(false);
      setIsAnimating(true);

      // Remove from DOM after animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
      }, ANIMATION_CLOSE);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Generate animation class
  const animationClass = [
    'transition-all',
    isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95',
    isVisible
      ? `duration-${ANIMATION_OPEN}`
      : `duration-${ANIMATION_CLOSE}`,
    isVisible ? 'ease-out' : 'ease-in',
  ].join(' ');

  return {
    isVisible,
    isAnimating,
    animationClass,
    shouldRender,
  };
}

