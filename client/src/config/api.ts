import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_SERVER_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
