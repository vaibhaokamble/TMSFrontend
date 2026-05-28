import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useTask } from '../contexts/TaskContext';
import { useTeam } from '../contexts/TeamContext';
import { useUser } from '../contexts/UserContext';
import { useUserTeams } from '../hooks/useUserTeams';
import { getTasks } from "../services/taskService";
import TaskForm from './TaskForm';
import TaskModal from './TaskModal';

const TaskBoard = ({ view = 'my-tasks', searchQuery = '' }) => {

  const {
    getSelectedTeam,
    selectedTeamId: contextSelectedTeamId,
    setSelectedTeamId: setContextSelectedTeamId,
    teams
  } = useTeam();

  const { assignTask } = useTask();
  const { currentUser } = useUser();
  const availableTeams = useUserTeams();
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  // Fetch Tasks From Backend
  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks = async () => {

    try {

      const response = await getTasks();

      console.log(response.data);

      // Change this according to backend response
      setTasks(response.data.data || response.data);

    } catch (error) {

      console.log(error);

    }
  };

  // Use selected team or first team as default
  const currentSelectedTeamId =
    contextSelectedTeamId ||
    (availableTeams.length > 0 ? availableTeams[0].id : null);

  const currentSelectedTeam =
    teams.find(team => team.id === currentSelectedTeamId) ||
    getSelectedTeam();

  useEffect(() => {

    if (currentSelectedTeamId && currentSelectedTeamId !== contextSelectedTeamId) {

      setContextSelectedTeamId(currentSelectedTeamId);

    }

  }, [
    currentSelectedTeamId,
    contextSelectedTeamId,
    setContextSelectedTeamId
  ]);

  // Filter Tasks
  const teamTasks =
    view === 'my-tasks' || view === 'assigned-tasks'

      ? tasks.filter((t) => {

          if (currentUser?.role === 'employee') {

            return (
              t.teamId === currentSelectedTeamId &&
              (
                t.assignedTo === currentUser?.name ||
                t.createdBy === currentUser?.id
              )
            );
          }

          if (
            currentUser?.role === 'team-lead' &&
            view === 'my-tasks'
          ) {

            return t.teamId === currentSelectedTeamId;
          }

          return t.assignedTo === currentUser?.name;
        })

      : tasks.filter(
          (t) => t.teamId === currentSelectedTeamId
        );

  // Search Filter
  const filteredTeamTasks = teamTasks.filter((task) => {

    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (

      task.title?.toLowerCase().includes(query) ||

      task.description?.toLowerCase().includes(query) ||

      task.assignedTo?.toLowerCase().includes(query) ||

      task.status?.toLowerCase().includes(query) ||

      task.dueDate?.toLowerCase().includes(query)

    );
  });

  const statuses = ['new', 'assigned', 'done'];

  const statusLabels = {

    new: {
      label: 'New',
      icon: '🔵',
      color: 'blue'
    },

    assigned: {
      label: 'Assign',
      icon: '🟡',
      color: 'yellow'
    },

    done: {
      label: 'Done',
      icon: '🟢',
      color: 'green'
    },
  };

  return (

    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
            🎯 {currentSelectedTeam?.name || 'Task Board'}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Click any task to view details or change its status
          </p>

        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap shadow-sm"
          >

            <Plus size={16} className="flex-shrink-0" />

            <span className="hidden sm:inline">
              Add Task
            </span>

            <span className="sm:hidden">
              Add
            </span>

          </button>

        </div>

      </div>

      {/* Task Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {statuses.map((status) => {

          const statusConfig = statusLabels[status];

          const statusTasks =
            filteredTeamTasks.filter(
              (t) => t.status === status
            );

          return (

            <div
              key={status}
              className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-dark-700"
            >

              {/* Column Header */}
              <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200 dark:border-dark-600">

                <div className="flex items-center justify-between gap-2">

                  <h2 className="font-bold text-xs sm:text-base text-gray-900 dark:text-white flex items-center gap-2 truncate">

                    <span>{statusConfig.icon}</span>

                    <span className="truncate">
                      {statusConfig.label}
                    </span>

                  </h2>

                  <span className="px-2 py-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full flex-shrink-0">

                    {statusTasks.length}

                  </span>

                </div>

              </div>

              {/* Tasks List */}
              <div className="space-y-2 sm:space-y-3 min-h-[100px]">

                {statusTasks.length > 0 ? (

                  statusTasks.map((task) => (

                    <div
                      key={task.id}
                      className="bg-white dark:bg-dark-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => {

                        setSelectedTask(task);

                        setShowTaskDetail(true);

                      }}
                    >

                      {/* Task Title */}
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600">

                        {task.title}

                      </h3>

                      {/* Status Badge */}
                      <div className="mb-3">

                        <StatusBadge status={task.status} />

                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">

                        {task.description}

                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs gap-2 border-t border-gray-100 dark:border-dark-700 pt-3">

                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          📅 {task.dueDate}
                        </span>

                        {task.assignedTo && (

                          <span className="text-gray-700 dark:text-gray-300 font-medium truncate">

                            👤 {task.assignedTo}

                          </span>

                        )}

                      </div>

                      {/* Self Assign */}
                      {status === 'new' &&
                        !task.assignedTo &&
                        (
                          currentUser?.role !== 'employee' ||
                          task.createdBy === currentUser?.id
                        ) && (

                        <button
                          onClick={(e) => {

                            e.stopPropagation();

                            assignTask(
                              task.id,
                              currentUser?.name,
                              currentUser?.id
                            );

                          }}
                          className="w-full mt-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold hover:bg-primary-100 transition-colors uppercase tracking-wider"
                        >

                          + Self Assign

                        </button>

                      )}

                    </div>

                  ))

                ) : (

                  <div className="flex flex-col items-center justify-center py-8 opacity-40">

                    <p className="text-xs font-medium text-gray-500">

                      Empty Column

                    </p>

                  </div>

                )}

              </div>

            </div>

          );
        })}

      </div>

      {/* Create Task Modal */}
      {showCreateModal && (

        <TaskForm
          onClose={() => setShowCreateModal(false)}
          isOpen={showCreateModal}
          teamId={currentSelectedTeamId}
        />

      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (

        <TaskModal
          task={selectedTask}
          onClose={() => {

            setShowTaskDetail(false);

            setSelectedTask(null);

          }}
          isOpen={showTaskDetail}
        />

      )}

    </div>
  );
};

export default TaskBoard;
