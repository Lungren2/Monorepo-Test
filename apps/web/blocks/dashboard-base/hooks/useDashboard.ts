/* =============================================================================
 * CONTEXT: blocks/dashboard-base/hooks
 * PATTERN: state-management-hook
 * DEPENDS_ON: React, types, constants
 * USED_BY: dashboard-base components
 * -----
 * Main dashboard state management hook.
 * Manages navigation state and inbox visibility.
 * =============================================================================
 */

import { useState, useCallback } from 'react';
import { UseDashboardState } from '../types';
import { DEFAULT_NAV_STATE } from '../constants';

export function useDashboard(): UseDashboardState {
  const [activeNavItem, setActiveNavItem] = useState<string>(DEFAULT_NAV_STATE.ACTIVE_ITEM);
  
  const isInboxActive = activeNavItem === 'Inbox';
  
  const toggleInbox = useCallback(() => {
    setActiveNavItem(prev => prev === 'Inbox' ? DEFAULT_NAV_STATE.ACTIVE_ITEM : 'Inbox');
  }, []);

  return {
    activeNavItem,
    isInboxActive,
    setActiveNavItem,
    toggleInbox,
  };
}
