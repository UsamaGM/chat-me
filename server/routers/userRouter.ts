import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  searchUsers,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, searchUsers);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
