import API from "./api";

export const getHousehold = async () => {
  const res = await API.get("/household");
  return res.data;
};

export const createHousehold = async (name) => {
  const res = await API.post("/household", { name });
  return res.data;
};

export const inviteMember = async (email) => {
  const res = await API.post("/household/invite", { email });
  return res.data;
};

export const acceptInvite = async (token) => {
  const res = await API.post(`/household/accept/${token}`);
  return res.data;
};
