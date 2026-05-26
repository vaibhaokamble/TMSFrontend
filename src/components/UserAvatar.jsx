import React from 'react';

const UserAvatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 dark:border-dark-700`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = ''; // Force fallback to initials
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold border border-primary-200 dark:border-primary-800`}
    >
      {getInitials(user?.name)}
    </div>
  );
};

export default UserAvatar;
