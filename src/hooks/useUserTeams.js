import { useMemo } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook to get teams available for current user
 * Eliminates code duplication across Dashboard, TaskBoard, TaskForm, etc.
 * 
 * @returns {Array} - Array of teams available to current user
 */
export const useUserTeams = () => {
  const { teams } = useTeam();
  const { currentUser } = useUser();

  return useMemo(() => {
    if (!teams || teams.length === 0 || !currentUser) return [];

    // Team Leads see only teams they lead
    if (currentUser.role === 'team-lead') {
      return teams.filter((team) => team.teamLeadId === currentUser.id);
    }

    // Employees see teams they are members of
    return teams.filter(
      (team) =>
        team.members?.includes(currentUser.id) ||
        team.teamLeadId === currentUser.id
    );
  }, [teams, currentUser]);
};
