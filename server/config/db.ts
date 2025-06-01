import mongoose from "mongoose";
import "colors";

async function connectDB() {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://localhost:27017/new-chat-app";
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`.green.underline);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`.red.italic);
    process.exit(1);
  }
}

export { connectDB };
