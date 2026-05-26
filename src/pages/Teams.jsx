import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import NotificationToast from '../components/NotificationToast';

import { getAllEmployees } from '../services/employeeService';

const Teams = ({ searchQuery = '' }) => {

  const { currentUser } = useUser();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {

    fetchTeams();

  }, []);

  const fetchTeams = async () => {

    try {

      const response = await getAllEmployees();

      console.log(response.data);

      const employees = response.data;

      const groupedTeams = {};

      employees.forEach((employee) => {

        const teamName = employee.team || "General";

        if (!groupedTeams[teamName]) {

          groupedTeams[teamName] = {
            id: teamName,
            name: teamName,
            description: `${teamName} Department Team`,
            members: [],
            memberDetails: [],
            teamLeadId: null,
          };
        }

        groupedTeams[teamName].members.push(employee.id);

        groupedTeams[teamName].memberDetails.push(employee);

        if (
          employee.role &&
          employee.role.toLowerCase() === "team-lead"
        ) {
          groupedTeams[teamName].teamLeadId = employee.id;
        }

      });

      setTeams(Object.values(groupedTeams));

    } catch (error) {

      console.log(error);

    }

  };

  const query = searchQuery.trim().toLowerCase();

  const visibleTeams = teams
    .filter(
      (team) =>
        team.id === currentUser?.team ||
        team.teamLeadId === currentUser?.id
    )
    .map((team) => {

      if (!query) return team;

      const filteredMembers =
        team.memberDetails?.filter((member) =>
          member.name?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.designation?.toLowerCase().includes(query) ||
          member.employeeId?.toLowerCase().includes(query) ||
          member.role?.toLowerCase().includes(query)
        ) || [];

      return {
        ...team,
        memberDetails: filteredMembers,
        matchesSearch:
          team.name?.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query) ||
          filteredMembers.length > 0,
      };
    })
    .filter((team) => !query || team.matchesSearch);

  const teamName = visibleTeams[0]?.name || 'My Team';

  if (currentUser?.role === 'employee') {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Access Denied
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Only Team Leads can access this page
          </p>
        </div>
      </div>
    );
  }

  const handleViewTeam = (team) => {

    setSelectedTeam(team);

    setShowTeamDetails(true);

  };

  const handleRemoveMember = (memberId) => {

    if (!selectedTeam) return;

    if (memberId === currentUser?.id) return;

    const updatedMembers = selectedTeam.memberDetails.filter(
      (member) => member.id !== memberId
    );

    setSelectedTeam({
      ...selectedTeam,
      memberDetails: updatedMembers,
    });

    setNotificationMessage("Member removed successfully");

    setShowNotification(true);

  };

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            👥 {teamName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Managing the {currentUser?.team || 'assigned'} department roster
          </p>

        </div>

      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 gap-4">

        {visibleTeams.map((team) => {

          const isTeamLead =
            team.teamLeadId === currentUser?.id;

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

                  {/* Team Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">

                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{team.members.length} members</span>
                    </div>

                    <div>
                      👑 {isTeamLead
                        ? 'You are Team Lead'
                        : 'Led by Team Lead'}
                    </div>

                  </div>

                </div>

              </div>

              {/* Team Members Preview */}
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

              {/* Actions */}
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

      {/* Empty State */}
      {visibleTeams.length === 0 && (

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-12 text-center">

          <Users
            size={48}
            className="mx-auto text-gray-400 dark:text-dark-600 mb-4"
          />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No team members found
          </h3>

          <p className="text-gray-600 dark:text-gray-400">
            No employees found in your department.
          </p>

        </div>

      )}

      {/* Team Details Modal */}
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

                  {selectedTeam.memberDetails?.map((member) => (

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

                        {selectedTeam.teamLeadId === member.id ? (

                          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                            Team Lead
                          </span>

                        ) : (

                          <button
                            onClick={() =>
                              handleRemoveMember(member.id)
                            }
                            className="px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                          >
                            Remove
                          </button>

                        )}

                      </div>

                    </div>

                  ))}

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