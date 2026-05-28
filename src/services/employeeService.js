import api from './api';

// Backend endpoints (as per API docs):
// GET  /employees
// PATCH /update/{employeeId}
// DELETE /employees/{id}

const API_PATH = '/employees';

export const getAllEmployees = async () => {
  return await api.get(API_PATH);
};

export const getEmployeeById = async (id) => {
  return await api.get(`${API_PATH}/${id}`);
};

// Update by employeeId (e.g. KDZ123) using PATCH /update/{employeeId}
export const updateEmployee = async (employeeId, employeeData) => {
  return await api.patch(`/update/${employeeId}`, employeeData);
};

export const deleteEmployee = async (id) => {
  return await api.delete(`${API_PATH}/${id}`);
};
