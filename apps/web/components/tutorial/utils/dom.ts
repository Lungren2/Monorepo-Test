import { SpotlightRect } from '../types';
import { roundRect } from './positioning';

/**
 * Safely extracts an Element from various ref types
 */
export function extractElement(
  ref: React.RefObject<Element> | Element
): Element | null {
  if (!ref) return null;

  if (ref instanceof Element) {
    return ref;
  }

  if (ref.current && ref.current instanceof Element) {
    return ref.current;
  }

  return null;
}

/**
 * Computes the bounding rectangle for a DOM element
 */
export function computeElementRect(element: Element): SpotlightRect {
  return roundRect(element.getBoundingClientRect());
}

/**
 * Safely focuses an element with error handling
 */
export function safeFocus(element: Element, delay = 120): void {
  if (typeof element.focus !== 'function') return;

  setTimeout(() => {
    try {
      element.focus();
    } catch (error) {
      // Silently fail if focus fails
      console.warn('Failed to focus element:', error);
    }
  }, delay);
}

/**
 * Sets up resize observer for an element
 */
export function createResizeObserver(
  element: Element,
  callback: () => void
): ResizeObserver | null {
  if (typeof ResizeObserver === 'undefined') return null;

  try {
    const observer = new ResizeObserver(callback);
    observer.observe(element);
    return observer;
  } catch (error) {
    console.warn('Failed to create ResizeObserver:', error);
    return null;
  }
}
