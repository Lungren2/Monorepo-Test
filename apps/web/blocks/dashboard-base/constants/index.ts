/* =============================================================================
 * CONTEXT: blocks/dashboard-base/constants
 * PATTERN: configuration-constants
 * DEPENDS_ON: None
 * USED_BY: dashboard-base components and hooks
 * -----
 * Configuration constants for dashboard-base functionality.
 * Centralizes all magic numbers and default values.
 * =============================================================================
 */

// Sidebar configuration
export const SIDEBAR_CONFIG = {
  WIDTH: '350px',
  COLLAPSIBLE_MODE: 'icon' as const,
  INBOX_COLLAPSIBLE_MODE: 'none' as const,
} as const;

// Default navigation state
export const DEFAULT_NAV_STATE = {
  ACTIVE_ITEM: 'Playground',
  INBOX_ACTIVE: false,
} as const;

// Mail display configuration
export const MAIL_CONFIG = {
  PREVIEW_WIDTH: '260px',
  MAX_PREVIEW_LINES: 2,
  SEARCH_PLACEHOLDER: 'Type to search...',
  UNREAD_LABEL: 'Unreads',
} as const;

// Team configuration
export const TEAM_CONFIG = {
  DEFAULT_PLAN: 'Enterprise',
  DEFAULT_LOGO_SIZE: 'size-4',
} as const;

// User configuration
export const USER_CONFIG = {
  AVATAR_SIZE: 'h-8 w-8',
  FALLBACK_TEXT: 'CN',
} as const;

// Animation and timing
export const ANIMATION_CONFIG = {
  CHEVRON_ROTATION_DURATION: 'duration-200',
  TRANSITION_EASE: 'ease-linear',
} as const;

// CSS classes
export const CSS_CLASSES = {
  SIDEBAR_OVERFLOW: 'overflow-hidden *:data-[sidebar=sidebar]:flex-row',
  COLLAPSIBLE_GROUP: 'group/collapsible',
  CHEVRON_ROTATION: 'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
  MAIL_ITEM: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0',
  MAIL_PREVIEW: 'line-clamp-2 w-[260px] text-xs whitespace-break-spaces',
} as const;
