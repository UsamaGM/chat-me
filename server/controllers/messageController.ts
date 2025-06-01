import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message from "../models/Message";
import User from "../models/User";
import Chat from "../models/Chat";

async function addNewMessage(req: AuthRequest, res: Response) {
  const { chat, content } = req.body;

  try {
    const message = new Message({
      content,
      chat,
      sender: req.user?._id,
    });
    const newMessage = await (
      await (await message.save()).populate("chat")
    ).populate("sender");

    const updatedChat = await Chat.findByIdAndUpdate(
      chat,
      {
        latestMessage: newMessage._id,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("latestMessage");

    res.status(200).json({ newMessage, updatedChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Failed to create new Message!" });
  }
}

export { addNewMessage };
