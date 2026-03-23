import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { logout as clearToken } from "../utils/authStorage";

// ⚠️ We’ll inject logout later
let onUnauthorized: (() => void) | null = null;

// Allow AuthContext to register a logout handler
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

const api = axios.create({
  baseURL: "http://10.148.127.170:5000/api/v1",
});

// 🔐 Attach JWT to every request
api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  if (Platform.OS === "web") {
    token = localStorage.getItem("accessToken");
  } else {
    token = await AsyncStorage.getItem("accessToken");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 GLOBAL 401 HANDLER
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Global 401 detected — logging out");

      await clearToken();

      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
