import chatRoutes from "./routes/chatRoutes";
import "colors";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

configDotenv();
console.log("Environment variables loaded:".green.bold);

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join-chat", (chatId) => {
    console.log(`User ${socket.id} joined chat: ${chatId}`);
    socket.join(chatId);
  });

  socket.on("leave-chat", (chatId) => {
    console.log(`User ${socket.id} left the chat: ${chatId}`);
    socket.leave(chatId);
  });

  socket.on("message", (message) => {
    console.log(
      `Message received in chat ${message.chat._id}:`,
      message.content
    );
    io.in(message.chat._id).emit("chat-updated", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.blue.bold);
});
