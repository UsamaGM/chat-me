import express from "express";
import { addNewMessage } from "../controllers/messageController";
import { addReaction, removeReaction } from "../controllers/reactionController";
import authMiddleware from "../middlewares/authMiddleware";
import { body } from "express-validator";

const router = express.Router();

// Message routes
router.post("/", authMiddleware, addNewMessage);

// Reaction routes
router.post(
  "/reactions", 
  authMiddleware, 
  [
    body("messageId").notEmpty().withMessage("Message ID is required"),
    body("emoji")
      .notEmpty()
      .isLength({ min: 1, max: 4 })
      .withMessage("Invalid emoji format")
  ],
  addReaction
);

router.delete(
  "/reactions",
  authMiddleware,
  [
    body("messageId").notEmpty().withMessage("Message ID is required"),
    body("reactionId").notEmpty().withMessage("Reaction ID is required")
  ],
  removeReaction
);

export default router;
