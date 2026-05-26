/**
 * Input Validation Utilities
 * Reusable validation functions for forms and data
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates employee ID
 * @param {string} employeeId - Employee ID to validate
 * @returns {object} - { isValid, error }
 */
export const validateEmployeeId = (employeeId) => {
  if (!employeeId || employeeId.trim().length === 0) {
    return { isValid: false, error: 'Employee ID is required' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid, errors }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates that a string is not empty
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {object} - { isValid, error }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  const isValid = value && value.trim().length > 0;
  return {
    isValid,
    error: isValid ? '' : `${fieldName} is required`,
  };
};

/**
 * Validates task title
 * @param {string} title - Title to validate
 * @returns {object} - { isValid, error }
 */
export const validateTaskTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Task title is required' };
  }
  if (title.trim().length > 200) {
    return { isValid: false, error: 'Task title must be less than 200 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validates team name
 * @param {string} name - Team name to validate
 * @returns {object} - { isValid, error }
 */
export const validateTeamName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Team name is required' };
  }
  if (name.trim().length < 3) {
    return { isValid: false, error: 'Team name must be at least 3 characters' };
  }
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Team name must be less than 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Sanitizes string input to prevent XSS
 * @param {string} value - Value to sanitize
 * @returns {string} - Sanitized value
 */
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates form data
 * @param {object} formData - Form data to validate
 * @param {object} rules - Validation rules { fieldName: validatorFunction }
 * @returns {object} - { isValid, errors: { fieldName: errorMessage } }
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((fieldName) => {
    const validator = rules[fieldName];
    const value = formData[fieldName];
    const result = validator(value);

    if (!result.isValid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
