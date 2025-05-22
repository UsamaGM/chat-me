import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message from "../models/Message";
import User from "../models/User";

async function addNewMessage(req: AuthRequest, res: Response) {
  const { chat, content } = req.body;

  try {
    const createdMessage = await Message.create({
      content,
      chat,
      sender: req.user?._id,
    });

    const newMessage = await User.populate(createdMessage, "sender");

    res.status(200).json({ newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Failed to create new Message!" });
  }
}

export { addNewMessage };
