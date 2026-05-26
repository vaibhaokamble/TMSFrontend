import api from "./api";

export const addComment = (taskId, data) => {
  return api.post(
    `/api/tasks/${taskId}/comments`,
    data
  );
};
