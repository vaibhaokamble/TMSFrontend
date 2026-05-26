import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: '🔵 New', color: '#3B82F6' },
    assigned: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', label: '🟡 Assign', color: '#F59E0B' },
    done: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: '🟢 Done', color: '#10B981' },
    pending: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: '⚫ Pending', color: '#6B7280' },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${config.bg} ${config.text} truncate`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
