import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();

const TEAMS_STORAGE_KEY = 'vm_task_teams';
const CURRENT_USER_KEY = 'vm_task_current_user';
const REGISTERED_USERS_KEY = 'vm_task_registered_users';

const domainLabels = {
  java: 'Java Development Team',
  python: 'Python Development Team',
  devops: 'DevOps Engineering Team',
  hr: 'Human Resources Team',
  tester: 'QA Testing Team',
  frontend: 'Frontend Development Team',
  designer: 'UI/UX Design Team',
  manager: 'Project Management Team',
};

const getDerivedTeams = () => {
  try {
    const usersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    
    // Group users by their 'team' (domain)
    const domains = [...new Set(users.map((u) => u.team).filter(Boolean))];

    return domains.map((domainId) => {
      const domainUsers = users.filter((u) => u.team === domainId);
      const teamLead = domainUsers.find((u) => u.role === 'team-lead');
      
      return {
        id: domainId,
        name: domainLabels[domainId] || `${domainId.toUpperCase()} Team`,
        description: `All ${domainId} professionals in the organization.`,
        teamLeadId: teamLead?.id || 'admin',
        members: domainUsers.map((u) => u.id),
        memberDetails: domainUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role === 'team-lead' ? 'Team Lead' : 'Employee',
          employeeId: u.employeeId,
          designation: domainLabels[domainId] || domainId,
        })),
        createdAt: '2024-01-01',
        status: 'active',
      };
    });
  } catch (err) {
    console.error('Error deriving teams:', err);
    return [];
  }
};

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState(() => getDerivedTeams());
  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    try {
      const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      return currentUser?.team || (teams[0]?.id || null);
    } catch (err) {
      return null;
    }
  });

  // Sync teams when users change
  useEffect(() => {
    const syncTeams = () => {
      const newTeams = getDerivedTeams();
      setTeams(newTeams);
      
      // Update selected team if not set
      if (!selectedTeamId && newTeams.length > 0) {
        const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserRaw) {
          const currentUser = JSON.parse(currentUserRaw);
          setSelectedTeamId(currentUser?.team || newTeams[0].id);
        } else {
          setSelectedTeamId(newTeams[0].id);
        }
      }
    };

    window.addEventListener('user-registered', syncTeams);
    return () => window.removeEventListener('user-registered', syncTeams);
  }, [selectedTeamId]);

  // Save teams to localStorage for compatibility
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

  return (
    <TeamContext.Provider value={{
      teams,
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
