import { io } from "socket.io-client";

const createSocket = () =>
  io("http://localhost:3000/", {
    transports: ["websocket"],
    withCredentials: true,
  });

export default createSocket;
