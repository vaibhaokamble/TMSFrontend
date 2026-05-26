import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

/**
 * ⚠️ SECURITY WARNING ⚠️
 * 
 * CRITICAL: Passwords are currently stored in PLAIN TEXT in localStorage.
 * 
 * THIS IS A MAJOR SECURITY VULNERABILITY!
 * 
 * For production use:
 * 1. NEVER store passwords client-side
 * 2. Use backend authentication (server-side sessions)
 * 3. Hash passwords with bcrypt (minimum 10 rounds)
 * 4. Use HTTPS for all communications
 * 5. Implement password reset via email tokens
 * 6. Use secure session cookies (HttpOnly, Secure flags)
 * 
 * This is demo/prototype code only.
 */

const formatUserName = (email) => {
  const namePart = email.split('@')[0] || 'User';
  return namePart
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ') || 'User';
};

const createUserFromCredentials = (email, role, customName = null, team = null, employeeId = null) => ({
  id: `user-${Date.now()}`,
  name: customName || formatUserName(email),
  email,
  employeeId,
  role: role || 'employee',
  team: team || null,
  teams: [],
});

// LocalStorage Keys
const REGISTERED_USERS_KEY = 'vm_task_registered_users';
const CURRENT_USER_KEY = 'vm_task_current_user';

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem(REGISTERED_USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  // Check if email already exists
  const emailExists = (email) => {
    const users = getRegisteredUsers();
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  };

  const login = (employeeId, password, role = 'employee') => {
    setIsLoading(true);
    setLoginError('');

    setTimeout(() => {
      const users = getRegisteredUsers();
      const registeredUser = users.find(
        (user) =>
          user.employeeId?.toLowerCase() === employeeId.toLowerCase() ||
          user.email.toLowerCase() === employeeId.toLowerCase()
      );

      // Validation checks
      if (!registeredUser) {
        setLoginError('User not found. Please register first.');
        setIsLoading(false);
        return;
      }

      // Check if password matches
      if (registeredUser.password !== password) {
        setLoginError('Invalid password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Check if role matches registered role
      if (registeredUser.role !== role) {
        setLoginError(
          `Invalid role. You registered as ${registeredUser.role}. Please select the correct role.`
        );
        setIsLoading(false);
        return;
      }

      // Create user object (without password)
      const userToSet = createUserFromCredentials(
        registeredUser.email,
        registeredUser.role,
        registeredUser.name,
        registeredUser.team,
        registeredUser.employeeId || employeeId
      );

      setCurrentUser(userToSet);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSet));
      setIsLoading(false);
    }, 1000);
  };

  const register = (name, employeeId, email, password, role, team) => {
    setIsLoading(true);
    setRegistrationError('');

    setTimeout(() => {
      // Check if email already exists
      if (emailExists(email)) {
        setRegistrationError('Email already registered. Please use a different email or login.');
        setIsLoading(false);
        return;
      }

      const normalizedEmployeeId = employeeId.trim().toUpperCase();
      const users = getRegisteredUsers();
      if (users.some((user) => user.employeeId?.toLowerCase() === normalizedEmployeeId.toLowerCase())) {
        setRegistrationError('Employee ID already registered. Please use a different employee ID.');
        setIsLoading(false);
        return;
      }

      // Create new user object with password for storage
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        employeeId: normalizedEmployeeId,
        email: email.toLowerCase(),
        password, // Store for login validation
        role,
        team,
        registeredAt: new Date().toISOString(),
      };

      // Save to registered users
      users.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      window.dispatchEvent(new Event('user-registered'));

      // Set registration success flag
      setRegistrationSuccess(true);
      setRegistrationError('');
      setIsLoading(false);
    }, 1500);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        registrationSuccess,
        setRegistrationSuccess,
        registrationError,
        setRegistrationError,
        emailExists,
        loginError,
        setLoginError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
