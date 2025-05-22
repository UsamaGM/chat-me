import express from "express";
import { addNewMessage } from "../controllers/messageController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addNewMessage);

export default router;
