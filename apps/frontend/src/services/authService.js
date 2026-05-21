import API from "./api";

export const sendSignupOtp = async (data) => {
  const res = await API.post("/auth/signup/send-otp", data);
  return res.data;
};

export const resendSignupOtp = async (email) => {
  const res = await API.post("/auth/signup/resend-otp", { email });
  return res.data;
};

export const verifySignupOtp = async (data) => {
  const res = await API.post("/auth/signup/verify-otp", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const loginWithGoogle = async (credential) => {
  const res = await API.post("/auth/google", { credential });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const loginWithGithub = async (code) => {
  const res = await API.post("/auth/github", { code });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await API.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
