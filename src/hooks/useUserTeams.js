import { useMemo } from 'react';
import { useTeam } from '../contexts/TeamContext';

/**
 * Custom hook to get teams available for current user
 * Eliminates code duplication across Dashboard, TaskBoard, TaskForm, etc.
 *
 * @returns {Array} - Array of teams available to current user
 */
export const useUserTeams = () => {
  const { myTeam } = useTeam();

  return useMemo(() => {
    return myTeam ? [myTeam] : [];
  }, [myTeam]);
};
