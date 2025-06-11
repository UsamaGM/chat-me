import express from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  registerUser,
  resetPassword,
  searchUsers,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import { authLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.get("/:search", authMiddleware, searchUsers);
router.post("/register", registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
