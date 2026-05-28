import { X } from 'lucide-react';
import { useState } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { useUser } from '../contexts/UserContext';
import { useUserTeams } from '../hooks/useUserTeams';
import { createTask as createTaskApi } from "../services/taskService";
import { validateTaskTitle } from '../utils/validation';

const TaskForm = ({ onClose, isOpen, teamId: propTeamId }) => {

  const { currentUser } = useUser();
  const availableTeams = useUserTeams();
  const { selectedTeamId: contextSelectedTeamId } = useTeam();
  const [formData, setFormData] = useState({

    title: '',

    description: '',

    status: 'NEW',

    dueDate: '',

    assignedTo: '',

  });

  // Team Selection
  const effectiveTeamId =
    propTeamId ||
    contextSelectedTeamId;

  const selectedTeam =
    availableTeams.find(
      (team) => team.id === effectiveTeamId
    );

  const fallbackTeam = selectedTeam || availableTeams[0];

  const teamIdToUse =
    selectedTeam?.id ||
    fallbackTeam?.id ||
    effectiveTeamId;

  if (!isOpen) return null;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));
  };

  // Team Members
  const teamMembers =
    selectedTeam?.memberDetails ||
    fallbackTeam?.memberDetails ||
    [];

  const currentUserEmployeeId =
    currentUser?.employeeId || currentUser?.id || '';

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Title Validation
    const titleValidation =
      validateTaskTitle(formData.title);

    if (!titleValidation.isValid) {

      alert(titleValidation.error);

      return;
    }

    // Description Validation
    if (
      formData.description &&
      formData.description.length > 500
    ) {

      alert(
        'Description must be less than 500 characters'
      );

      return;
    }

    // Due Date Validation
    if (
      formData.dueDate &&
      currentUser?.role === 'team-lead'
    ) {

      const selectedDate =
        new Date(formData.dueDate);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {

        alert('Due date cannot be in the past');

        return;
      }
    }

    if (!teamIdToUse) {

      alert(
        'Your account is not linked to a team yet'
      );

      return;
    }

    // Assign Member Name
    let assignedToId = null;

    if (formData.assignedTo) {

      if (
        formData.assignedTo === currentUserEmployeeId
      ) {

        assignedToId = currentUserEmployeeId;

      } else {

        const selectedMember =
          teamMembers.find(
            (m) =>
              m.employeeId === formData.assignedTo ||
              m.id === formData.assignedTo
          );

        assignedToId =
          selectedMember?.employeeId || selectedMember?.id || null;
      }
    }

    const finalStatus =
      assignedToId &&
      String(formData.status).toUpperCase() === 'NEW'
        ? 'ASSIGN'
        : String(formData.status || 'NEW').toUpperCase();

    // API CALL
    try {

      const response =
        await createTaskApi({

          title: formData.title,

          description: formData.description,

          status: finalStatus,

          dueDate: formData.dueDate,

          teamId: teamIdToUse,

          assignedToId,

        });

      console.log(response.data);

      window.dispatchEvent(new Event('tasks-updated'));

      alert("Task Created Successfully");

      setFormData({

        title: '',

        description: '',

        status: 'NEW',

        dueDate: '',

        assignedTo: '',

      });

      onClose();

    } catch (error) {

      console.log(error);

      alert("Failed To Create Task");

    }
  };

  return (

    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >

      <div
        className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">

          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            Create New Task
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors flex-shrink-0"
          >

            <X size={20} />

          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >

          {/* Team */}
          <div>

            <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Team *
            </label>

            <div className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">

              {selectedTeam?.name ||
                fallbackTeam?.name ||
                'Assigned team'}

            </div>

          </div>

          {/* Title */}
          <div>

            <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Task Title *
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />

          </div>

          {/* Description */}
          <div>

            <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />

          </div>

          {/* Status + Due Date */}
          <div className={
            currentUser?.role === 'employee'
              ? 'block'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
          }>

            {/* Status */}
            <div>

              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >

                <option value="NEW">
                  New
                </option>

                <option value="ASSIGN">
                  Assign
                </option>

                <option value="DONE">
                  Done
                </option>

              </select>

            </div>

            {/* Due Date */}
            {currentUser?.role === 'team-lead' && (

              <div>

                <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />

              </div>

            )}

          </div>

          {/* Assign To */}
          {currentUser?.role === 'team-lead' && (

            <div>

              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Assign To
              </label>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >

                <option value="">
                  — Unassigned —
                </option>

                <option value={currentUserEmployeeId}>
                  🙋 Assign to Me ({currentUser?.name})
                </option>

                {teamMembers.map((member) => (

                  <option
                    key={member.employeeId || member.id}
                    value={member.employeeId || member.id}
                  >

                    {member.name} ({member.role})

                  </option>

                ))}

              </select>

            </div>

          )}

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-4 sm:pt-6">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors"
            >

              Cancel

            </button>

            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors"
            >

              Create Task

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default TaskForm;
