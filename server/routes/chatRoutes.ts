import {
  accessChat,
  addToGroup,
  createGroupChat,
  getChatById,
  getUserChats,
  removeFromGroup,
} from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getUserChats)
  .post(authMiddleware, accessChat);

router.get("/:id", authMiddleware, getChatById);
router.post("/group", authMiddleware, createGroupChat);
router.put("/group-add", authMiddleware, addToGroup);
router.put("/group-remove", authMiddleware, removeFromGroup);

export default router;
