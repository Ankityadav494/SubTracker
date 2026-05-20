import API from "./api";

export const getOverview = async () => {
  const res = await API.get("/analytics/overview");
  return res.data;
};

export const getTrends = async () => {
  const res = await API.get("/analytics/trends");
  return res.data;
};

export const getSavings = async () => {
  const res = await API.get("/analytics/savings");
  return res.data;
};
