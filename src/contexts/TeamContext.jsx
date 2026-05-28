import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAllEmployees } from '../services/employeeService';
import { buildTeamsFromEmployees, extractEmployeesFromResponse, findTeamForUser } from '../utils/teamHelpers';
import { useUser } from './UserContext';

const TeamContext = createContext();

const TEAMS_STORAGE_KEY = 'vm_task_teams';

const getStoredTeams = () => {
  try {
    const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
    return storedTeams ? JSON.parse(storedTeams) : [];
  } catch (err) {
    console.error('Error loading teams from localStorage:', err);
    return [];
  }
};

export const TeamProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [teams, setTeams] = useState(() => getStoredTeams());
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setTeams([]);
      setSelectedTeamId(null);
      setError('');
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const syncTeams = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getAllEmployees();
        const employees = extractEmployeesFromResponse(response.data);
        const derivedTeams = buildTeamsFromEmployees(employees);

        if (!isActive) return;

        const nextTeams = derivedTeams.length > 0 ? derivedTeams : getStoredTeams();
        setTeams(nextTeams);
        localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));

        const resolvedTeam = findTeamForUser(nextTeams, currentUser);
        setSelectedTeamId(resolvedTeam?.id || nextTeams[0]?.id || null);
      } catch (err) {
        if (!isActive) return;

        console.error('Error loading teams from backend:', err);
        setError('Unable to load teams from backend.');

        const fallbackTeams = getStoredTeams();
        setTeams(fallbackTeams);
        setSelectedTeamId(findTeamForUser(fallbackTeams, currentUser)?.id || fallbackTeams[0]?.id || null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    syncTeams();

    return () => {
      isActive = false;
    };
  }, [currentUser?.employeeId, currentUser?.email, currentUser?.role]);

  useEffect(() => {
    if (!currentUser || teams.length === 0) return;

    const resolvedTeam = findTeamForUser(teams, currentUser);
    if (resolvedTeam?.id && resolvedTeam.id !== selectedTeamId) {
      setSelectedTeamId(resolvedTeam.id);
    }
  }, [teams, currentUser, selectedTeamId]);

  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    }
  }, [teams]);

  const createTeam = () => {
    console.warn('Manual team creation is deprecated.');
    return null;
  };

  const updateTeam = () => {
    console.warn('Manual team update is restricted.');
  };

  const deleteTeam = () => {
    console.warn('Manual team deletion is restricted.');
  };

  const addTeamMember = () => {
    console.warn('Manual member addition is deprecated.');
  };

  const removeTeamMember = () => {
    console.warn('Manual member removal is deprecated.');
  };

  const getTeamById = (teamId) => {
    return teams.find((team) => team.id === teamId);
  };

  const getSelectedTeam = () => {
    return getTeamById(selectedTeamId);
  };

  const myTeam = useMemo(() => findTeamForUser(teams, currentUser), [teams, currentUser]);

  return (
    <TeamContext.Provider value={{
      teams,
      myTeam,
      isLoading,
      error,
      selectedTeamId,
      setSelectedTeamId,
      createTeam,
      updateTeam,
      deleteTeam,
      addTeamMember,
      removeTeamMember,
      getTeamById,
      getSelectedTeam,
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
};
