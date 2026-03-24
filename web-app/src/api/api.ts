import axios from "axios";

const API = axios.create({
  baseURL: "http://180.235.121.253:8078/api/v1",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
    console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;