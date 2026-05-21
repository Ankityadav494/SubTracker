import API from "./api";

export const getSubscriptions = async (params = {}) => {
  const res = await API.get("/subscriptions", { params });
  return res.data;
};

export const getSubscription = async (id) => {
  const res = await API.get(`/subscriptions/${id}`);
  return res.data;
};

export const addSubscription = async (data) => {
  const res = await API.post("/subscriptions", data);
  return res.data;
};

export const updateSubscription = async (id, data) => {
  const res = await API.put(`/subscriptions/${id}`, data);
  return res.data;
};

export const deleteSubscription = async (id) => {
  const res = await API.delete(`/subscriptions/${id}`);
  return res.data;
};
