import express from "express";
import {
  loginUser,
  registerUser,
  searchUsers,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, searchUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
