import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Sidebar Context
export const SidebarContext = React.createContext<{
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
} | null>(null);

/**
 * Constants (kept compatible with sidebar.tsx)
 */
export const SIDEBAR_COOKIE_NAME = 'sidebar:state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

/**
 * SSR‑safe cookie helpers
 */
function readSidebarCookie(defaultValue: boolean): boolean {
  if (typeof document === 'undefined') return defaultValue;
  const entry = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
  if (!entry) return defaultValue;
  const value = entry.split('=')[1];
  return value === 'true';
}

function writeSidebarCookie(value: boolean) {
  if (typeof document === 'undefined') return;
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  /** Uncontrolled initial state (persisted via cookie). */
  defaultOpen?: boolean;
  /** Controlled prop. If provided, the component becomes controlled. */
  open?: boolean;
  /** Controlled onChange callback. */
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & SidebarProviderProps
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();

    // Internal (uncontrolled) desktop state; initialized lazily from cookie
    const [internalOpen, setInternalOpen] = React.useState<boolean>(() =>
      readSidebarCookie(defaultOpen)
    );

    // Separate mobile sheet/drawer state
    const [openMobile, setOpenMobile] = React.useState(false);

    // Derived open value: controlled wins over internal
    const open = openProp ?? internalOpen;

    // Public setter that supports both boolean and functional updates
    const setOpen = React.useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const next =
          typeof value === 'function'
            ? (value as (p: boolean) => boolean)(open)
            : value;
        if (typeof setOpenProp === 'function') {
          setOpenProp(next);
        } else {
          setInternalOpen(next);
        }
      },
      [open, setOpenProp]
    );

    // Persist desktop state to cookie whenever it changes (unified place)
    React.useEffect(() => {
      // Persist only the desktop sidebar state (not the mobile sheet)
      writeSidebarCookie(open);
    }, [open]);

    // Toggle respects platform (mobile/desktop)
    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((v) => !v);
      } else {
        setOpen((v) => !v);
      }
    }, [isMobile, setOpen]);

    // Keyboard shortcut: Cmd/Ctrl + b
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          (event.key === SIDEBAR_KEYBOARD_SHORTCUT ||
            event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT) &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    // Effective visibility for styling
    const effectiveOpen = isMobile ? openMobile : open;
    const state: 'expanded' | 'collapsed' = effectiveOpen
      ? 'expanded'
      : 'collapsed';

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': isMobile
                  ? SIDEBAR_WIDTH_MOBILE
                  : SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...(style as React.CSSProperties),
              } as React.CSSProperties
            }
            className={cn(
              'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
              className
            )}
            ref={ref}
            data-state={state}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);

SidebarProvider.displayName = 'SidebarProvider';
