import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
};

const NotificationToast = ({ type = 'success', message = '', isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen || !message) {
    return null;
  }

  const Icon = icons[type] || CheckCircle2;


  return (
    <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-50 w-full max-w-sm rounded-lg sm:rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-xl shadow-black/10 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full flex-shrink-0 ${type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-909/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
          <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
          {message}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 flex-shrink-0 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
