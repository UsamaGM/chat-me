import chatRoutes from "./routes/chatRoutes";
import "colors";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
import express from "express";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

configDotenv();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000".blue.bold);
});
