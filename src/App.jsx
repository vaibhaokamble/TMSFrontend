import { useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { EmployeesProvider } from './contexts/EmployeesContext';
import { TaskProvider } from './contexts/TaskContext';
import { TeamProvider } from './contexts/TeamContext';
import { UserProvider, useUser } from './contexts/UserContext';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Login from './pages/Login';
import Registration from './pages/Registration';
import TaskBoard from './pages/TaskBoard';
import Teams from './pages/Teams';

import Analytics from './pages/Analytics';

function AppContent() {
  const { currentUser } = useUser();
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Role-based access control: redirect employees from restricted tabs
  useEffect(() => {
    if (currentUser && currentUser.role === 'employee') {
      if (activeTab === 'dashboard' || activeTab === 'employees') {
        setActiveTab('my-tasks');
      }
    }
  }, [currentUser, activeTab]);

  if (!currentUser) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Registration onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      {activeTab === 'dashboard' && <Dashboard searchQuery={searchQuery} />}
      {activeTab === 'employees' && <Employees searchQuery={searchQuery} />}
      {activeTab === 'teams' && <Teams searchQuery={searchQuery} />}
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'my-tasks' && <TaskBoard view="my-tasks" searchQuery={searchQuery} />}
      {activeTab === 'assigned-tasks' && <TaskBoard view="assigned-tasks" searchQuery={searchQuery} />}
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <EmployeesProvider>
          <TeamProvider>
            <TaskProvider>
              <AppContent />
            </TaskProvider>
          </TeamProvider>
        </EmployeesProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
