// Z-index constants for layering
export const Z_OVERLAY = 1_000_000;
export const Z_SPOTLIGHT = Z_OVERLAY + 1;
export const Z_POPOVER = Z_OVERLAY + 2;

// Animation constants
export const SPOTLIGHT_ANIMATION = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 40,
  mass: 0.35,
};

// Default values
export const DEFAULTS = {
  OPACITY: 0.6,
  DWELL: 1800,
  AUTO_FOCUS: true,
  AUTO_ADVANCE: false,
  BORDER_RADIUS: 8,
  FOCUS_DELAY: 120,
} as const;
