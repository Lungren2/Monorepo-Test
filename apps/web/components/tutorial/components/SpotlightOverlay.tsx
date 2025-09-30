import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpotlightRect } from '../types';
import { Z_OVERLAY, DEFAULTS } from '../constants';

interface SpotlightOverlayProps {
  isOpen: boolean;
  rect: SpotlightRect;
  opacity?: number;
}

export function SpotlightOverlay({
  isOpen,
  rect,
  opacity = DEFAULTS.OPACITY,
}: SpotlightOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="spotlight-root"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: Z_OVERLAY,
            pointerEvents: 'none',
          }}
        >
          {/* Spotlight hole */}
          <motion.div
            aria-hidden
            style={{
              position: 'fixed',
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
              borderRadius: DEFAULTS.BORDER_RADIUS,
              pointerEvents: 'none',
              boxShadow: `0 0 0 9999px rgba(0,0,0,${opacity})`,
            }}
          />

          {/* Top mask */}
          <motion.div
            aria-hidden
            style={{
              position: 'fixed',
              pointerEvents: 'auto',
              top: 0,
              left: 0,
              right: 0,
              height: rect.y,
            }}
          />

          {/* Left mask */}
          <motion.div
            aria-hidden
            style={{
              position: 'fixed',
              pointerEvents: 'auto',
              top: rect.y,
              left: 0,
              width: rect.x,
              height: rect.height,
            }}
          />

          {/* Right mask */}
          <motion.div
            aria-hidden
            style={{
              position: 'fixed',
              pointerEvents: 'auto',
              top: rect.y,
              left: rect.x + rect.width,
              right: 0,
              height: rect.height,
            }}
          />

          {/* Bottom mask */}
          <motion.div
            aria-hidden
            style={{
              position: 'fixed',
              pointerEvents: 'auto',
              top: rect.y + rect.height,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
