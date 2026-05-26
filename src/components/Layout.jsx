import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onTabChange, searchQuery, onSearchQueryChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useUser();

  // Reset to default tab based on user role when role changes
  useEffect(() => {
    if (currentUser?.role === 'employee') {
      // Employees can only access my-tasks
      if (activeTab !== 'my-tasks') {
        onTabChange('my-tasks');
      }
    }
  }, [currentUser?.role, activeTab, onTabChange]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-dark-900">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} isMobileMenuOpen={isMobileMenuOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
