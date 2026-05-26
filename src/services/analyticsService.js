import api from "./api";

export const getOverview = () => {
  return api.get("/api/analytics/overview");
};
