import jwt from "jsonwebtoken";
import mongoose from "mongoose";

function generateToken(id: mongoose.Types.ObjectId) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default", {
    expiresIn: "30d",
  });
}

export default generateToken;
