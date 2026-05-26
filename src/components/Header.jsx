import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import logo from '../assets/logo.png';

const Header = ({ onMenuToggle, isMobileMenuOpen, searchQuery, onSearchQueryChange }) => {
  const { currentUser, logout } = useUser();

  const handleLogout = () => {
    logout();
    // Redirect to login - implement routing later
  };

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-sm sticky top-0 z-40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 lg:px-6 lg:py-4 gap-3 sm:gap-0">
        {/* Top Row - Logo, Menu Toggle, and User on mobile */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <img
              src={logo}
              alt="Application logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover flex-shrink-0"
            />
            <h1 className="hidden xs:hidden sm:block text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Task Manager
            </h1>
          </div>

          {/* User Profile - Mobile */}
          <div className="flex sm:hidden items-center gap-1 pl-2 border-l border-gray-200 dark:border-dark-700">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut size={16} className="text-danger" />
            </button>
          </div>
        </div>

        {/* Bottom Row - Search (visible below on mobile, inline on desktop) */}
        <div className="w-full sm:flex-1 sm:max-w-md sm:mx-4 px-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 sm:px-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
        </div>

        {/* Right side - Actions (Desktop only) */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-4">
          {/* User Profile - Desktop */}
          <div className="flex items-center gap-2 pl-2 lg:pl-4 border-l border-gray-200 dark:border-dark-700">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {currentUser?.role.replace('-', ' ')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
              title="Logout"
            >
              <LogOut size={18} className="text-danger" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
