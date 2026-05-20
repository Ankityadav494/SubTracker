import API from "./api";

export const getSettings = async () => {
  const res = await API.get("/users/settings");
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await API.put("/users/settings", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await API.put("/users/password", data);
  return res.data;
};
