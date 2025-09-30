export const SIDEBAR_UI = {
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-300 ease-in-out',
    FAST: 'transition-all duration-200 ease-in-out',
  },
  SPACING: {
    ITEM_GAP: 'space-y-1',
    CONTENT_PADDING: 'px-3',
    ICON_SIZE: 'h-4 w-4',
  },
  STATES: {
    ACTIVE:
      'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
    HOVER: 'hover:bg-sidebar-accent/80',
    COLLAPSED: 'justify-center px-0 w-full h-full',
    COLLAPSED_ICON: 'justify-center px-0 w-full h-full',
    EXPANDED: 'gap-3 px-3',
  },
  LAYOUT: {
    COLLAPSED_ICON: 'sr-only',
    EXPANDED_TEXT: 'block',
  },
} as const;
