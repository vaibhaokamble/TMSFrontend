import api from "./api";

const API_PATH = "/api/employees";

export const getAllEmployees = async () => {
  return await api.get(API_PATH);
};

export const getEmployeeById = async (id) => {
  return await api.get(`${API_PATH}/${id}`);
};

export const updateEmployee = async (id, employeeData) => {
  return await api.put(
    `${API_PATH}/${id}`,
    employeeData
  );
};

export const deleteEmployee = async (id) => {
  return await api.delete(`${API_PATH}/${id}`);
};
