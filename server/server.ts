import { configDotenv } from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import "colors";

configDotenv();
const app = express();
connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000".blue.bold);
});
