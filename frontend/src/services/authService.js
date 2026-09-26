import api from "./api";
import CryptoJs from "crypto-js";

const hashPassword = (password) => {
  return CryptoJs.SHA256(password).toString();
};

export const login = async (username, password) => {
  try {
    const clientHashedPassword = hashPassword(password);
    const response = await api.post("/auth/login", {
      username,
      password: clientHashedPassword,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    // Menangkap error dari Axios (status 401, 500, atau koneksi terputus)
    const message =
      error.response?.data?.message || "Terjadi kesalahan saat login";

    return {
      success: false,
      message,
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));
