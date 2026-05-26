import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();
const TASKS_STORAGE_KEY = 'vm_task_tasks';
const TEAMS_STORAGE_KEY = 'vm_task_teams';
const CURRENT_USER_KEY = 'vm_task_current_user';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task) => {
          if (task.status === 'in-progress') {
            return { ...task, status: 'assigned' };
          }
          return task;
        });
      } catch (err) {
        console.error('Error loading tasks from localStorage:', err);
        localStorage.removeItem(TASKS_STORAGE_KEY);
      }
    }

    const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserRaw) return [];

    try {
      const currentUser = JSON.parse(currentUserRaw);
      const teamRaw = localStorage.getItem(TEAMS_STORAGE_KEY);
      const teams = teamRaw ? JSON.parse(teamRaw) : [];
      const seedTeamId = teams[0]?.id;

      if (!seedTeamId) return [];

      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      const demoTasks = [
        {
          id: 'task-demo-1',
          title: 'Set up sprint board',
          description: 'Create baseline workflow and columns for the team.',
          status: 'new',
          dueDate: today,
          teamId: seedTeamId,
          createdBy: currentUser.id,
          assignedTo: null,
          createdAt: now,
          updatedAt: now,
          comments: [],
          activityLog: [
            {
              userId: currentUser.id,
              action: 'Task created',
              message: '',
              timestamp: 'just now',
            },
          ],
        },
        {
          id: 'task-demo-2',
          title: 'Prepare release notes',
          description: 'Summarize completed work and testing status.',
          status: 'assigned',
          dueDate: today,
          teamId: seedTeamId,
          createdBy: currentUser.id,
          assignedTo: currentUser.name,
          createdAt: now,
          updatedAt: now,
          comments: [],
          activityLog: [
            {
              userId: currentUser.id,
              action: 'Task created',
              message: '',
              timestamp: 'just now',
            },
          ],
        },
        {
          id: 'task-demo-3',
          title: 'Finalize onboarding checklist',
          description: 'Complete the checklist for new joiners.',
          status: 'done',
          dueDate: today,
          teamId: seedTeamId,
          createdBy: currentUser.id,
          assignedTo: currentUser.name,
          createdAt: now,
          updatedAt: now,
          comments: [],
          activityLog: [
            {
              userId: currentUser.id,
              action: 'Task created',
              message: '',
              timestamp: 'just now',
            },
          ],
        },
      ];
      
      return demoTasks;
    } catch (err) {
      console.error('Error preparing demo tasks:', err);
      return [];
    }
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const createTask = (taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: now,
      updatedAt: now,
      comments: [],
      activityLog: [
        {
          userId: taskData.createdBy,
          action: 'Task created',
          message: '',
          timestamp: 'just now',
        },
      ],
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  const updateTask = (taskId, taskData) => {
    setTasks((prevTasks) => prevTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...taskData,
            updatedAt: new Date().toISOString().split('T')[0],
            activityLog: [
              ...task.activityLog,
              {
                userId: taskData.updatedBy || task.createdBy,
                action: taskData.statusChanged ? `Status changed to "${taskData.status}"` : 'Task updated',
                message: taskData.message || '',
                timestamp: 'just now',
              },
            ],
          }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const assignTask = (taskId, userId, assignerUserId) => {
    updateTask(taskId, {
      assignedTo: userId,
      status: 'assigned',
      statusChanged: true,
      updatedBy: assignerUserId,
      message: 'Assigned to team member',
    });
  };

  const updateTaskStatus = (taskId, newStatus, userId) => {
    updateTask(taskId, {
      status: newStatus,
      // Clear assignedTo when moving back to 'new' status
      assignedTo: newStatus === 'new' ? null : undefined,
      statusChanged: true,
      updatedBy: userId,
    });
  };

  const getTasksByTeam = (teamId) => {
    return tasks.filter((task) => task.teamId === teamId);
  };

  const getTasksByUser = (userId) => {
    return tasks.filter((task) => task.assignedTo === userId);
  };

  const getTasksByStatus = (teamId, status) => {
    return tasks.filter((task) => task.teamId === teamId && task.status === status);
  };

  const addComment = (taskId, userId, userName, comment) => {
    setTasks((prevTasks) => prevTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            comments: [
              ...task.comments,
              {
                id: `comment-${Date.now()}`,
                userId,
                userName,
                text: comment,
                timestamp: new Date().toLocaleString(),
              },
            ],
          }
        : task
    ));
  };

  const getTaskById = (taskId) => {
    return tasks.find((task) => task.id === taskId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        assignTask,
        updateTaskStatus,
        getTasksByTeam,
        getTasksByUser,
        getTasksByStatus,
        addComment,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};
