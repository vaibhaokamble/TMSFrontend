import { Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmModal from "../components/ConfirmModal";

import { useTask } from "../contexts/TaskContext";
import { useTeam } from "../contexts/TeamContext";
import { useUser } from "../contexts/UserContext";

import {
  updateTask as updateTaskApi,
} from "../services/taskService";

import { addComment } from "../services/commentService";

const TaskModal = ({ task, onClose, isOpen }) => {

  const { deleteTask, getTaskById } = useTask();

  const { getTeamById } = useTeam();

  const { currentUser } = useUser();

  const [newComment, setNewComment] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);

  const [permissionError, setPermissionError] =
    useState("");

  const [editedTask, setEditedTask] = useState({
    status: "NEW",
    assignedUserId: "",
  });

  const prevTaskRef = useRef(null);

  const liveTask = getTaskById(task?.id) || task;

  const team = getTeamById(liveTask?.teamId);

  const teamMembers = team?.memberDetails || [];

  const currentUserEmployeeId =
    currentUser?.employeeId || currentUser?.id || "";

  const isTaskCreator =
    liveTask?.createdBy === currentUserEmployeeId ||
    liveTask?.createdById === currentUserEmployeeId;

  const isTeamLead =
    currentUser?.role === "team-lead";

  const isAssignee =
    liveTask?.assignedToId === currentUserEmployeeId ||
    liveTask?.assignedTo === currentUser?.name;

  const canEdit =
    isTaskCreator || isTeamLead || isAssignee;

  const canDelete =
    isTaskCreator || isTeamLead;

  const canChangeStatus =
    isAssignee || isTeamLead;

  const canAssign = isTeamLead;

  useEffect(() => {

    if (!liveTask) return;

    if (prevTaskRef.current === liveTask.id) return;

    prevTaskRef.current = liveTask.id;

    const member = teamMembers.find(
      (m) => m.employeeId === liveTask.assignedToId || m.id === liveTask.assignedToId || m.name === liveTask.assignedTo
    );

    setEditedTask({
      status: String(liveTask?.status || "NEW").toUpperCase(),
      assignedUserId: member?.employeeId || member?.id || "",
    });

  }, [liveTask, teamMembers]);

  if (!isOpen || !task) return null;

  const handleDeleteTask = () => {

    if (!canDelete) {

      setPermissionError(
        "Only creator or team lead can delete"
      );

      return;
    }

    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTask = () => {

    deleteTask(liveTask.id);

    setShowDeleteConfirmation(false);

    onClose();
  };

  // ADD COMMENT API
  const handleAddComment = async () => {

    if (!newComment.trim()) return;

    try {

      await addComment(
        liveTask.id,
        {
          text: newComment,
        }
      );

      alert("Comment Added");

      setNewComment("");

    } catch (error) {

      console.log(error);

      alert("Failed To Add Comment");
    }
  };

  // UPDATE TASK API
  const handleSave = async () => {

    if (!canEdit) {

      setPermissionError(
        "You do not have permission"
      );

      return;
    }

    const selectedMember =
      teamMembers.find(
        (m) =>
          m.employeeId === editedTask.assignedUserId ||
          m.id === editedTask.assignedUserId
      );

    try {

      await updateTaskApi(
        liveTask.id,
        {
          title: liveTask.title,
          description: liveTask.description,
          teamId: liveTask.teamId,
          dueDate: liveTask.dueDate,
          status: String(editedTask.status || "NEW").toUpperCase(),

          assignedToId:
            editedTask.status === "NEW"
              ? null
              : selectedMember?.employeeId || selectedMember?.id || null,
        }
      );

      window.dispatchEvent(new Event('tasks-updated'));

      alert("Task Updated");

      onClose();

    } catch (error) {

      console.log(error);

      alert("Failed To Update Task");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >

      <div
        className="bg-white dark:bg-dark-800 rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700">

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Task Details
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">

          {/* Error */}
          {permissionError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                {permissionError}
              </p>
            </div>
          )}

          {/* Title */}
          <div>

            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {liveTask.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {liveTask.description}
            </p>

          </div>

          {/* Status */}
          <div>

            <label className="text-sm font-medium block mb-2">
              Status
            </label>

            <select
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  status: String(e.target.value || 'NEW').toUpperCase(),
                })
              }
              disabled={!canChangeStatus}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="NEW">New</option>
              <option value="ASSIGN">Assigned</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Assign */}
          {canAssign && (
            <div>

              <label className="text-sm font-medium block mb-2">
                Assign To
              </label>

              <select
                value={editedTask.assignedUserId}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    assignedUserId:
                      e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg"
              >

                <option value="">
                  Unassigned
                </option>

                {teamMembers.map((member) => (

                  <option
                    key={member.employeeId || member.id}
                    value={member.employeeId || member.id}
                  >
                    {member.name}
                  </option>

                ))}

              </select>

            </div>
          )}

          {/* Comments */}
          <div>

            <p className="text-sm font-medium mb-2">
              Comments
            </p>

            <div className="space-y-2">

              {liveTask.comments &&
              liveTask.comments.length > 0 ? (

                liveTask.comments.map((comment) => (

                  <div
                    key={comment.id}
                    className="bg-gray-100 p-2 rounded"
                  >

                    <p className="font-medium text-sm">
                      {comment.userName}
                    </p>

                    <p className="text-sm">
                      {comment.text}
                    </p>

                  </div>

                ))

              ) : (

                <p className="text-sm text-gray-500">
                  No comments yet
                </p>

              )}

            </div>

          </div>

          {/* Add Comment */}
          <div className="flex gap-2">

            <input
              type="text"
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              placeholder="Write comment..."
              className="flex-1 border px-3 py-2 rounded-lg"
            />

            <button
              onClick={handleAddComment}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t">

          <button
            onClick={handleDeleteTask}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>

          <div className="flex gap-2">

            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Close
            </button>

            <button
              onClick={handleSave}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

      <ConfirmModal
        isOpen={showDeleteConfirmation}
        onCancel={() =>
          setShowDeleteConfirmation(false)
        }
        onConfirm={confirmDeleteTask}
      />

    </div>
  );
};

export default TaskModal;
