import api from "./api";

export const registerEmployee = async (employeeData) => {
  return await api.post(
    "/auth/register",
    employeeData
  );
};

export const loginEmployee = async (loginData) => {
  return await api.post(
    "/auth/login",
    loginData
  );
};
