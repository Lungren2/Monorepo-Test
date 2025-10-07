// Core tutorial types
export interface TutorialStep {
  id: string;
  ref: React.RefObject<Element> | Element;
  title?: React.ReactNode;
  body?: React.ReactNode;
  side?: 'top' | 'bottom';
  autoFocus?: boolean;
  path?: string; // Optional path for cross-page tutorials
}

export interface TutorialContext {
  index: number;
  total: number;
  prev: () => void;
  next: () => void;
  close: () => void;
  atEnd: boolean;
}

export interface SpotlightLayerProps {
  opacity?: number;
  steps?: TutorialStep[];
  run?: boolean;
  autoAdvance?: boolean;
  dwell?: number;
  autoFocus?: boolean;
  onDone?: () => void;
  renderContent?: (step: TutorialStep, ctx: TutorialContext) => React.ReactNode;
  // Next.js navigation callback
  onNavigation?: (path: string) => void | Promise<void>;
}

// Spotlight-specific types
export interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpotlightContextValue {
  isOpen: boolean;
  rect: SpotlightRect;
  openForRef: (ref: React.RefObject<Element> | Element) => void;
  close: () => void;
}

// Tutorial store types
export interface TutorialStoreStep {
  id: string;
  path?: string; // Optional for Next.js compatibility
  title?: string;
  body?: string;
  side?: 'top' | 'bottom';
  autoFocus?: boolean;
}

export interface TutorialOptions {
  autoAdvance?: boolean;
  dwell?: number;
  autoFocus?: boolean;
}

export interface TutorialState {
  steps: TutorialStoreStep[];
  index: number;
  running: boolean;
  autoAdvance: boolean;
  dwell: number;
  autoFocus: boolean;
  targets: Record<string, Element | null | undefined>;

  // Methods
  currentStep: () => TutorialStoreStep | null;
  currentTarget: () => Element | null;
  start: (steps: TutorialStoreStep[], opts?: TutorialOptions) => void;
  stop: () => void;
  reset: () => void;
  next: () => void;
  prev: () => void;
  goto: (i: number) => void;
  setAutoAdvance: (v: boolean) => void;
  setDwell: (ms: number) => void;
  setAutoFocus: (v: boolean) => void;
  registerTarget: (id: string, el: Element | null | undefined) => void;
  needsNavigation: (currentPathname: string) => string | null;
  // Next.js navigation helper
  navigateToStep?: (path: string) => Promise<void> | void;
}
