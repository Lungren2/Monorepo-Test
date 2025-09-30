import React from 'react';
import { SpotlightContextValue, SpotlightRect } from '../types';
import {
  extractElement,
  computeElementRect,
  createResizeObserver,
} from '../utils/dom';

interface SpotlightProviderProps {
  children: React.ReactNode;
}

export function SpotlightProvider({ children }: SpotlightProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rect, setRect] = React.useState<SpotlightRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const targetElRef = React.useRef<Element | null>(null);

  const computeRect = React.useCallback(() => {
    const el = targetElRef.current;
    if (!el) return;
    setRect(computeElementRect(el));
  }, []);

  const openForRef = React.useCallback(
    (ref: React.RefObject<Element> | Element) => {
      const el = extractElement(ref);
      if (!el) return;

      targetElRef.current = el;
      computeRect();
      setIsOpen(true);
    },
    [computeRect]
  );

  const close = React.useCallback(() => {
    setIsOpen(false);
    targetElRef.current = null;
  }, []);

  // Auto-align spotlight with target
  React.useEffect(() => {
    if (!isOpen) return;

    let animationFrame: number | null = null;

    const scheduleUpdate = () => {
      if (animationFrame != null) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        computeRect();
      });
    };

    const handleScroll = () => scheduleUpdate();
    const handleResize = () => scheduleUpdate();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (targetElRef.current) {
      resizeObserver = createResizeObserver(
        targetElRef.current,
        scheduleUpdate
      );
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);

      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      }

      if (animationFrame != null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isOpen, computeRect]);

  const value: SpotlightContextValue = React.useMemo(
    () => ({ isOpen, rect, openForRef, close }),
    [isOpen, rect, openForRef, close]
  );

  return (
    <SpotlightContext.Provider value={value}>
      {children}
    </SpotlightContext.Provider>
  );
}
