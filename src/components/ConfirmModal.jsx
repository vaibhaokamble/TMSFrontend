import React from 'react';
import { X, Trash2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-xl sm:rounded-3xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-xl overflow-hidden">
        <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700 gap-2 sm:gap-4">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 text-red-700 dark:text-red-200">
            <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800 flex-shrink-0">
              <Trash2 size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg sm:rounded-xl border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors order-2 sm:order-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition-colors order-1 sm:order-2"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
