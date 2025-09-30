// Core components
export { SpotlightProvider } from './components/SpotlightProvider';
export { SpotlightLayer } from './components/SpotlightLayer';
export { SpotlightOverlay } from './components/SpotlightOverlay';
export { TutorialContent } from './components/TutorialContent';

// Hooks
export { useSpotlight } from './hooks/useSpotlight';
export { useTutorial } from './hooks/useTutorial';

// Store
export { useTutorialStore } from './stores/tutorialStore';

// Types
export type {
  TutorialStep,
  TutorialContext,
  SpotlightLayerProps,
  SpotlightRect,
  SpotlightContextValue,
  TutorialStoreStep,
  TutorialOptions,
  TutorialState,
} from './types';

// Constants
export {
  Z_OVERLAY,
  Z_SPOTLIGHT,
  Z_POPOVER,
  SPOTLIGHT_ANIMATION,
  DEFAULTS,
} from './constants';

// Utilities
export {
  chooseSide,
  getSpotlightCenter,
  createAnchorStyle,
  roundRect,
} from './utils/positioning';

export {
  extractElement,
  computeElementRect,
  safeFocus,
  createResizeObserver,
} from './utils/dom';
