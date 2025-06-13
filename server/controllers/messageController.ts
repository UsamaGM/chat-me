import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { Socket } from "socket.io";

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
    ).populate("sender", "name email pic _id");

    await Chat.findByIdAndUpdate(chat, {
      latestMessage: newMessage._id,
    });

    const io: Socket = req.app.get("io");
    io.in(chat).emit("chat-updated", newMessage);

    res.status(200).json({ newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Failed to create new Message!" });
  }
}

export { addNewMessage };
