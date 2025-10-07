import React from 'react';
import { SpotlightContextValue } from '../types';

export const SpotlightContext =
  React.createContext<SpotlightContextValue | null>(null);

export function useSpotlight(): SpotlightContextValue {
  const ctx = React.useContext(SpotlightContext);
  if (!ctx) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return ctx;
}
