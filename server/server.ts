import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db";
import "colors";
import userRouter from "./routers/userRouter";

configDotenv();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000".blue.bold);
});
