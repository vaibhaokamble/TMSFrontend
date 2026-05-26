import React, { createContext, useContext, useEffect, useState } from 'react';

const EmployeesContext = createContext();

const REGISTERED_USERS_KEY = 'vm_task_registered_users';

const formatDesignationFromTeam = (team) => {
  const teamMap = {
    java: 'Java Developer',
    python: 'Python Developer',
    devops: 'DevOps Engineer',
    hr: 'Human Resources',
    tester: 'QA Tester',
    frontend: 'Frontend Developer',
    designer: 'UI/UX Designer',
    manager: 'Project Manager',
  };

  return teamMap[team] || 'Team Member';
};

const mapRegisteredUserToEmployee = (registeredUser, index) => ({
  id: `emp-reg-${registeredUser.id}`,
  employeeId: registeredUser.employeeId || `EMP${(index + 1).toString().padStart(3, '0')}`,
  name: registeredUser.name,
  email: registeredUser.email,
  designation: formatDesignationFromTeam(registeredUser.team),
  role: registeredUser.role === 'team-lead' ? 'Team Lead' : 'Employee',
  status: 'Active',
  createdAt: (registeredUser.registeredAt || new Date().toISOString()).split('T')[0],
});

const getRegisteredEmployees = () => {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  const users = raw ? JSON.parse(raw) : [];
  return users.map((user, index) => mapRegisteredUserToEmployee(user, index));
};

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
    // Sample employees - in a real app, this would come from a backend
    {
      id: 'emp-1',
      employeeId: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      designation: 'Software Developer',
      role: 'Employee',
      status: 'Active',
      createdAt: '2024-01-15',
    },
    {
      id: 'emp-2',
      employeeId: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      designation: 'UI/UX Designer',
      role: 'Employee',
      status: 'Active',
      createdAt: '2024-01-20',
    },
  ]);

  useEffect(() => {
    // Bootstrap signed-up users into Employees list and keep list in sync after registration.
    const mergeRegisteredUsers = () => {
      setEmployees((prev) => {
        const registeredEmployees = getRegisteredEmployees();
        const manualEmployees = prev.filter((emp) => !emp.id.startsWith('emp-reg-'));
        return [...manualEmployees, ...registeredEmployees];
      });
    };

    mergeRegisteredUsers();

    const handleUserRegistered = () => {
      mergeRegisteredUsers();
    };

    window.addEventListener('user-registered', handleUserRegistered);
    return () => {
      window.removeEventListener('user-registered', handleUserRegistered);
    };
  }, []);

  const addEmployee = (employeeData) => {
    // Generate employee ID
    const employeeNumber = (employees.length + 1).toString().padStart(3, '0');
    const employeeId = `EMP${employeeNumber}`;

    const newEmployee = {
      id: `emp-${Date.now()}`,
      employeeId,
      ...employeeData,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (employeeId, employeeData) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, ...employeeData } : emp
    ));
  };

  const deleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const getEmployeeById = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  return (
    <EmployeesContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployeeById,
    }}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeesProvider');
  }
  return context;
};