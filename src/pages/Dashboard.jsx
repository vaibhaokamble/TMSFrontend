import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import UserAvatar from '../components/UserAvatar';
import { useUser } from '../contexts/UserContext';
import { getTasks, normalizeTaskListResponse } from '../services/taskService';

const Dashboard = ({ searchQuery = '' }) => {

  const { currentUser } = useUser();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    fetchTasks();

    const handleTasksUpdated = () => {
      fetchTasks();
    };

    window.addEventListener('tasks-updated', handleTasksUpdated);
    return () => window.removeEventListener('tasks-updated', handleTasksUpdated);

  }, []);

  const fetchTasks = async () => {

    try {

      const response = await getTasks();

      console.log(response.data);

      setTasks(normalizeTaskListResponse(response.data));

    } catch (error) {

      console.log(error);

    }
  };

  const teamTasks = tasks;

  const query = searchQuery.trim().toLowerCase();

  const filteredTeamTasks = teamTasks.filter((task) => {

    if (!query) return true;

    return (
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.assignedTo?.toLowerCase().includes(query) ||
      task.status?.toLowerCase().includes(query) ||
      task.dueDate?.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {

    total: filteredTeamTasks.length,

    pending: filteredTeamTasks.filter(
      (t) => String(t.status || '').toUpperCase() === 'NEW'
    ).length,

    assigned: filteredTeamTasks.filter(
      (t) => String(t.status || '').toUpperCase() === 'ASSIGN'
    ).length,

    done: filteredTeamTasks.filter(
      (t) => String(t.status || '').toUpperCase() === 'DONE'
    ).length,
  };

  // Recent Tasks
  const recentTasks = [...filteredTeamTasks]
    .sort((a, b) => {

      const dateA = new Date(a.createdAt);

      const dateB = new Date(b.createdAt);

      return dateB - dateA;

    })
    .slice(0, 5);

  return (

    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">

            Welcome back, {currentUser?.name}!

          </h1>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">

            Here's your task overview for today

          </p>

        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon="📊"
          color="blue"
          description="Total tasks you are involved in"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="yellow"
          description="Tasks waiting to be started"
        />

        <StatCard
          title="In Progress"
          value={stats.assigned}
          icon="🚀"
          color="pink"
          description="Tasks currently assigned"
        />

        <StatCard
          title="Completed"
          value={stats.done}
          icon="✅"
          color="green"
          description="Successfully finished tasks"
        />

      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">

        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">

            📌 Recent Tasks

          </h2>

          {teamTasks.length > 5 && (

            <button className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">

              View All

            </button>

          )}

        </div>

        <div className="divide-y divide-gray-200 dark:divide-dark-700">

          {recentTasks.length > 0 ? (

            recentTasks.map((task) => (

              <div
                key={task.id}
                className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">

                      <h3 className="font-medium text-xs sm:text-base text-gray-900 dark:text-white truncate">

                        {task.title}

                      </h3>

                      <StatusBadge status={task.status} />

                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">

                      {task.description}

                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm">

                      <span className="text-gray-500 dark:text-gray-400">

                        📅 Due: {task.dueDate || 'No date'}

                      </span>

                      {(task.assignedTo || task.assignedToId) && (

                        <div className="flex items-center gap-1">

                          <span className="text-xs text-gray-600 dark:text-gray-400">

                            Assigned:

                          </span>

                          <UserAvatar
                            user={{
                              name: task.assignedTo,
                              avatar:
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo || task.assignedToId}`,
                            }}
                            size="xs"
                          />

                        </div>

                      )}

                    </div>

                  </div>

                  <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors flex-shrink-0 self-start sm:self-auto">

                    <MoreVertical
                      size={16}
                      className="text-gray-400"
                    />

                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="p-12 text-center">

              <p className="text-sm text-gray-500 dark:text-gray-400">

                No tasks found yet.

              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
  description
}) => {

  const colorClasses = {

    blue:
      'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',

    yellow:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',

    pink:
      'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',

    green:
      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  };

  return (

    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6 flex flex-col justify-between">

      <div className="flex items-start justify-between mb-4">

        <div>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">

            {title}

          </p>

          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">

            {value}

          </p>

        </div>

        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colorClasses[color]}`}>

          {icon}

        </div>

      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 italic">

        {description}

      </p>

    </div>
  );
};

export default Dashboard;
