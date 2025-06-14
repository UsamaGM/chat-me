import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { Socket } from "socket.io";
import { UserType } from "../models/User";

async function addNewMessage(req: AuthRequest, res: Response) {
  const { chat, content } = req.body;

  try {
    let message = await Message.create({
      content,
      chat,
      sender: req.user?._id,
    });

    message = await message.populate("sender", "name email pic");
    message = await message.populate({
      path: "chat",
      populate: {
        path: "users",
        select: "name email pic",
      },
    });

    await Chat.findByIdAndUpdate(chat, {
      latestMessage: message._id,
    });

    const io: Socket = req.app.get("io");
    if (message.chat && (message.chat as any).users) {
      (message.chat as any).users.forEach((user: UserType) => {
        io.in(user._id.toString()).emit("new message", message);
      });
    }

    res.sendStatus(200);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Failed to create new Message!" });
  }
}

export { addNewMessage };
