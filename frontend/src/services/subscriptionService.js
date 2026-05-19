import API from "./api";

// Get all subscriptions
export const getSubscriptions = async () => {
  const res = await API.get("/subscriptions");
  return res.data;
};

// Add subscription
export const addSubscription = async (data) => {
  const res = await API.post("/subscriptions", data);
  return res.data;
};

// Delete subscription
export const deleteSubscription = async (id) => {
  const res = await API.delete(`/subscriptions/${id}`);
  return res.data;
};

// Update subscription (future use)
export const updateSubscription = async (id, data) => {
  const res = await API.put(`/subscriptions/${id}`, data);
  return res.data;
};