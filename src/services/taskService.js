import api from "./api";

export const createTask = (data) => {
  return api.post("/api/tasks", data);
};

export const updateTask = (id, data) => {
  return api.patch(`/api/tasks/${id}`, data);
};

export const getTasks = (team, status) => {
  return api.get("/api/tasks", {
    params: {
      team,
      status,
    },
  });
};
