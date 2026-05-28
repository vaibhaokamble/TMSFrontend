import api from "./api";

export const normalizeTaskListResponse = (responseData) => {
  const payload = responseData && responseData.data ? responseData.data : responseData;

  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.items)) return payload.items;

  return [];
};

export const createTask = (data) => {
  return api.post("/task", data);
};

export const updateTask = (id, data) => {
  return api.put(`/task/${id}`, data);
};

export const getTasks = (team, status) => {
  return api.get("/tasks", {
    params: {
      team,
      status,
    },
  });
};
