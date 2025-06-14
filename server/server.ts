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
import { apiLimiter } from "./middlewares/rateLimiter";
import Message from "./models/Message";

configDotenv();
console.log("Environment variables loaded:".green.bold);

const app = express();
connectDB();

// app.use(apiLimiter);
app.use(cors());
app.use(express.json());

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

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join-chat", (chatId) => {
    console.log(`User ${socket.id} joined chat: ${chatId}`);
    socket.join(chatId);
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("typing start", ({ chatId, userId }) => {
    console.log(`User ${userId} started typing in chat: ${chatId}`);
    socket.to(chatId).emit("user started typing", { userId, chatId });
  });

  socket.on("typing stop", ({ chatId, userId }) => {
    socket.to(chatId).emit("user stopped typing", { userId, chatId });
  });

  socket.on("message", (message) => {
    io.in(message.chat._id).emit("chat-updated", message);
  });

  socket.on("message-read", async ({ messageId, userId, chatId }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { seenBy: userId } },
        { new: true }
      ).populate("seenBy", "name pic _id");

      if (message) {
        io.in(chatId).emit("message-read-update", {
          messageId,
          seenBy: message.seenBy,
        });
      }
    } catch (error) {
      console.error("Error updating message read status:", error);
    }
  });

  socket.on("user-online", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} connected and joined their room.`.cyan);
    socket.broadcast.emit("user-status-change", { userId, status: "online" });
  });

  socket.on("user-offline", (userId) => {
    socket.leave(userId);
    console.log(`User ${userId} disconnected and left their room.`.red);
    socket.broadcast.emit("user-status-change", { userId, status: "offline" });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

httpServer.listen(process.env.PORT || 3300, () => {
  console.log(
    `Server is running on port ${process.env.PORT || 3300}`.blue.bold
  );
});
