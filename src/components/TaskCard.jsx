import React from 'react';

const TaskCard = ({ task, onClick }) => {
  console.log(task);
  const latestComment =
    task.comments && task.comments.length > 0
      ? task.comments[task.comments.length - 1]
      : null;

      
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-800 p-2.5 sm:p-3 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-700 mb-2 cursor-pointer space-y-1.5 hover:shadow-md dark:hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow duration-200"
    >
      {/* Title */}
      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {task.description}
      </p>

      {/* ✅ Assigned Employee */}
      {task.assignedTo && (
        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
          👤 {task.assignedTo}
        </p>
      )}

      {/* ✅ Latest Comment */}
      {latestComment && (
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          💬 {latestComment.text}
        </p>
      )}

      {/* ✅ Comment Count */}
      {task.comments?.length > 0 && (
        <p className="text-xs text-blue-500 dark:text-blue-400">
          💬 {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default TaskCard;