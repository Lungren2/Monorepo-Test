import React from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { SpotlightLayerProps, TutorialStep } from '../types';
import { useSpotlight } from '../hooks/useSpotlight';
import { useTutorial } from '../hooks/useTutorial';
import { SpotlightOverlay } from './SpotlightOverlay';
import { TutorialContent } from './TutorialContent';
import { extractElement, safeFocus } from '../utils/dom';
import { SPOTLIGHT_ANIMATION, DEFAULTS } from '../constants';

export function SpotlightLayer({
  opacity = DEFAULTS.OPACITY,
  steps = [],
  run = false,
  autoAdvance = DEFAULTS.AUTO_ADVANCE,
  dwell = DEFAULTS.DWELL,
  autoFocus = DEFAULTS.AUTO_FOCUS,
  onDone,
  renderContent,
}: SpotlightLayerProps) {
  const { isOpen, rect, openForRef, close } = useSpotlight();

  const {
    step,
    running,
    context,
    autoFocus: stepAutoFocus,
  } = useTutorial({
    steps,
    run,
    autoAdvance,
    dwell,
    autoFocus,
    onDone,
  });

  // Motion values for smooth animations
  const x = useMotionValue(rect.x);
  const y = useMotionValue(rect.y);
  const w = useMotionValue(rect.width);
  const h = useMotionValue(rect.height);

  // Animate spotlight position changes
  React.useEffect(() => {
    animate(x, rect.x, SPOTLIGHT_ANIMATION);
    animate(y, rect.y, SPOTLIGHT_ANIMATION);
    animate(w, rect.width, SPOTLIGHT_ANIMATION);
    animate(h, rect.height, SPOTLIGHT_ANIMATION);
  }, [rect.x, rect.y, rect.width, rect.height, x, y, w, h]);

  // Manage spotlight per step
  React.useEffect(() => {
    if (!running || !step) return;

    openForRef(step.ref);

    // Handle auto-focus
    if (stepAutoFocus) {
      const el = extractElement(step.ref);
      if (el) {
        safeFocus(el, DEFAULTS.FOCUS_DELAY);
      }
    }
  }, [running, step, openForRef, stepAutoFocus]);

  // Close spotlight when tutorial ends
  React.useEffect(() => {
    if (!running && isOpen) {
      close();
    }
  }, [running, isOpen, close]);

  return (
    <>
      {/* Spotlight overlay mask */}
      <SpotlightOverlay isOpen={isOpen} rect={rect} opacity={opacity} />

      {/* Tutorial content popover */}
      {running && step && (
        <TutorialContent
          step={step}
          context={context}
          rect={rect}
          renderContent={renderContent}
        />
      )}
    </>
  );
}
