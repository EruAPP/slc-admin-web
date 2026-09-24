import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));
