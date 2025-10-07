import React from 'react';
import { TutorialStep, TutorialContext } from '../types';
import { DEFAULTS } from '../constants';

interface UseTutorialOptions {
  steps?: TutorialStep[];
  run?: boolean;
  autoAdvance?: boolean;
  dwell?: number;
  autoFocus?: boolean;
  onDone?: () => void;
}

export function useTutorial({
  steps = [],
  run = false,
  autoAdvance = DEFAULTS.AUTO_ADVANCE,
  dwell = DEFAULTS.DWELL,
  autoFocus = DEFAULTS.AUTO_FOCUS,
  onDone,
}: UseTutorialOptions) {
  const [index, setIndex] = React.useState(0);

  const total = steps.length;
  const running = !!steps.length && !!run;
  const step = running ? steps[index] : null;
  const atEnd = running && index >= total - 1;

  const prev = React.useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = React.useCallback(() => {
    setIndex((i) => {
      const nextIndex = Math.min(i + 1, total);
      if (nextIndex >= total) {
        onDone?.();
        return i;
      }
      return nextIndex;
    });
  }, [total, onDone]);

  const close = React.useCallback(() => {
    onDone?.();
  }, [onDone]);

  // Auto-advance logic
  React.useEffect(() => {
    if (!running || !autoAdvance) return;

    const timer = setTimeout(() => {
      next();
    }, dwell);

    return () => clearTimeout(timer);
  }, [running, index, autoAdvance, dwell, next]);

  const context: TutorialContext = React.useMemo(
    () => ({
      index,
      total,
      prev,
      next,
      close,
      atEnd,
    }),
    [index, total, prev, next, close, atEnd]
  );

  return {
    step,
    running,
    context,
    autoFocus,
  };
}
