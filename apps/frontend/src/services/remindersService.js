import API from "./api";

export const getReminders = async () => {
  const res = await API.get("/reminders");
  return res.data;
};
