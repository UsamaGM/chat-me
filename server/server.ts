import "colors";
import cors from "cors";
import { connectDB } from "./config/db";
import { configDotenv } from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

configDotenv();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000".blue.bold);
});
