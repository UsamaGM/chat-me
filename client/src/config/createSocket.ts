import { io } from "socket.io-client";

const createSocket = () =>
  io(import.meta.env.VITE_BASE_SERVER_URL || "http://localhost:3000/", {
    transports: ["websocket"],
    withCredentials: true,
  });

export default createSocket;
