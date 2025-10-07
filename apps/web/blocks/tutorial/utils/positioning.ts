import { SpotlightRect } from '../types';

/**
 * Determines the optimal side for popover placement based on available space
 */
export function chooseSide(
  rect: SpotlightRect,
  popoverHeight = 180
): 'top' | 'bottom' {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const margin = 12;
  const roomBelow = vh - (rect.y + rect.height);
  return roomBelow >= popoverHeight + margin ? 'bottom' : 'top';
}

/**
 * Calculates the center point of a spotlight rectangle
 */
export function getSpotlightCenter(rect: SpotlightRect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * Creates the anchor style for popover positioning at spotlight center
 */
export function createAnchorStyle(
  rect: SpotlightRect,
  zIndex: number
): React.CSSProperties {
  const center = getSpotlightCenter(rect);
  return {
    position: 'fixed' as const,
    left: center.x,
    top: center.y,
    width: 0,
    height: 0,
    zIndex,
  };
}

/**
 * Rounds rectangle values for consistent positioning
 */
export function roundRect(rect: DOMRect): SpotlightRect {
  return {
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}
