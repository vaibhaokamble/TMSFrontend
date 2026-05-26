import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: '🟢 Low' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', label: '🟡 Medium' },
    high: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: '🔴 High' },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold ${config.bg} ${config.text} truncate`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
