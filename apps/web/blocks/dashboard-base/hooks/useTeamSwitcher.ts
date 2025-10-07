/* =============================================================================
 * CONTEXT: blocks/dashboard-base/hooks
 * PATTERN: state-management-hook
 * DEPENDS_ON: React, types
 * USED_BY: team-switcher component
 * -----
 * Team switcher state management hook.
 * Manages active team selection and team switching logic.
 * =============================================================================
 */

import { useState, useCallback } from 'react';
import { Team } from '../types';

export function useTeamSwitcher(teams: Team[]) {
  const [activeTeam, setActiveTeam] = useState<Team>(teams[0]);

  const selectTeam = useCallback((team: Team) => {
    setActiveTeam(team);
  }, []);

  const isTeamActive = useCallback((team: Team) => {
    return activeTeam.name === team.name;
  }, [activeTeam]);

  return {
    activeTeam,
    selectTeam,
    isTeamActive,
  };
}
