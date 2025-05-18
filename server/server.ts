import "colors";
import cors from "cors";
import { connectDB } from "./config/db";
import { configDotenv } from "dotenv";
import express from "express";
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
