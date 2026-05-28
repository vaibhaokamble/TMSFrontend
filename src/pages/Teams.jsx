import { Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import NotificationToast from '../components/NotificationToast';
import { useTeam } from '../contexts/TeamContext';
import { useUser } from '../contexts/UserContext';
import { getEmployeeTeamKey } from '../utils/teamHelpers';

const Teams = ({ searchQuery = '' }) => {
  const { currentUser } = useUser();
  const { teams, myTeam, isLoading, error } = useTeam();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const query = searchQuery.trim().toLowerCase();
  const currentUserEmployeeId = currentUser?.employeeId || currentUser?.id;

  const currentTeam =
    myTeam ||
    teams.find(
      (team) => team.id === getEmployeeTeamKey(currentUser) || team.teamLeadId === currentUserEmployeeId
    ) ||
    null;

  const visibleTeams = useMemo(() => {
    if (!currentTeam) return [];

    if (!query) {
      return [currentTeam];
    }

    const filteredMembers =
      currentTeam.memberDetails?.filter((member) =>
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.designation?.toLowerCase().includes(query) ||
        member.employeeId?.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query)
      ) || [];

    const matchesSearch =
      currentTeam.name?.toLowerCase().includes(query) ||
      currentTeam.description?.toLowerCase().includes(query) ||
      filteredMembers.length > 0;

    return matchesSearch
      ? [{
          ...currentTeam,
          memberDetails: filteredMembers,
          matchesSearch,
        }]
      : [];
  }, [currentTeam, query]);

  const teamName = currentTeam?.name || 'My Team';
  const teamGroupLabel = currentTeam?.name || 'assigned team';
  const isTeamLead = currentTeam?.teamLeadId === currentUserEmployeeId;

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  const handleRemoveMember = (memberId) => {
    if (!selectedTeam || !isTeamLead) return;
    if (memberId === currentUserEmployeeId) return;

    const updatedMembers = selectedTeam.memberDetails.filter(
      (member) => member.id !== memberId
    );

    setSelectedTeam({
      ...selectedTeam,
      memberDetails: updatedMembers,
    });

    setNotificationMessage('Member removed successfully');
    setShowNotification(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {isLoading && (
        <div className="rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-4 text-sm text-gray-600 dark:text-gray-400">
          Loading your team from the backend...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            👥 {teamName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Managing the {teamGroupLabel} roster
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleTeams.map((team) => {
          const teamLeadName = team.memberDetails?.find(
            (member) => member.employeeId === team.teamLeadId || member.id === team.teamLeadId
          )?.name;

          const teamLeadLabel = isTeamLead
            ? 'You are Team Lead'
            : teamLeadName
              ? `Led by ${teamLeadName}`
              : 'Led by Team Lead';

          return (
            <div
              key={team.id}
              className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {team.name}
                    </h2>

                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                      🟢 Active
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {team.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{team.members.length} members</span>
                    </div>

                    <div>👑 {teamLeadLabel}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Members:
                </h3>

                <div className="flex flex-wrap gap-2">
                  {team.memberDetails?.slice(0, 8).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-dark-700">
                <button
                  onClick={() => handleViewTeam(team)}
                  className="flex-1 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors font-medium text-sm"
                >
                  View All Members
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleTeams.length === 0 && !isLoading && (
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-12 text-center">
          <Users
            size={48}
            className="mx-auto text-gray-400 dark:text-dark-600 mb-4"
          />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No team members found
          </h3>

          <p className="text-gray-600 dark:text-gray-400">
            We could not resolve a team for your account yet.
          </p>
        </div>
      )}

      {showTeamDetails && selectedTeam && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTeamDetails(false)}
        >
          <div
            className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTeam.name}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Full Team Roster
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTeam(null);
                  setShowTeamDetails(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <X
                  size={24}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  All Team Members ({selectedTeam.memberDetails.length})
                </h3>

                <div className="space-y-3">
                  {selectedTeam.memberDetails?.map((member) => {
                    const isLeadMember =
                      selectedTeam.teamLeadId === member.employeeId ||
                      selectedTeam.teamLeadId === member.id;

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </p>

                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.employeeId} • {member.designation}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {member.role}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isLeadMember ? (
                            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                              Team Lead
                            </span>
                          ) : isTeamLead ? (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationToast
        type="success"
        message={notificationMessage}
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default Teams;
