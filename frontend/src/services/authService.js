import API from "./api";

// Signup
export const signup = async (data) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

// Login
export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  // Save token
  localStorage.setItem("token", res.data.token);

  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
};