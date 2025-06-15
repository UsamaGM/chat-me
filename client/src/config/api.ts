import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_SERVER_URL + "/api" ||
    "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("authToken");
if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

export default api;
