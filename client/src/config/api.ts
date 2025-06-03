import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_SERVER_URL || "http://localhost:3000/api",
  // baseURL: "https://f460-39-63-69-174.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
