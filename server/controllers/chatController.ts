import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Chat from "../models/Chat";
import User from "../models/User";
import "colors";
import Message from "../models/Message";
import { Socket } from "socket.io";

async function accessChat(req: AuthRequest, res: Response) {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "No User Id provided!" });
    return;
  }

  let existingChat: any = await Chat.findOne({
    isGroupChat: false,
    $and: [{ users: userId }, { users: req.user?._id }],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  existingChat = await User.populate(existingChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (existingChat) {
    res.status(200).json({ chat: existingChat });
    return;
  } else {
    const chatData = {
      chatName: "p2p",
      isGroupChat: false,
      users: [req.user?._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const newChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).json({ chat: newChat });
  }
}

async function getUserChats(req: AuthRequest, res: Response) {
  try {
    let userChats: any = await Chat.find({
      users: req.user?._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    userChats = await User.populate(userChats, {
      path: "latestMessage",
      select: "name pic email",
    });

    res.json({ chats: userChats });
  } catch (error) {
    res.status(500).json({ message: "Server Error: Failed to fetch chats" });
  }
}

async function getChatById(req: AuthRequest, res: Response) {
  const { id } = req.params;

  try {
    const chat = await Chat.findOne({
      _id: id,
      users: { $elemMatch: { $eq: req.user?._id } },
    });

    if (!chat) {
      res
        .status(403)
        .json({ message: "Forbidden: You are not a member of this chat." });
      return;
    }

    const queriedChat = await Message.find({ chat: id })
      .populate("sender")
      .populate("reactions.userId")
      .sort({ createdAt: 1 });

    if (!queriedChat) {
      res.status(400).json({ message: "Bad request!" });
      return;
    }

    res.json({ queriedChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Failed to fetch the chat!" });
  }
}

async function createGroupChat(req: AuthRequest, res: Response) {
  const { chatName, users }: { chatName: string; users: [string] } = req.body;
  users.push(req.user?._id.toString()!);

  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      chatName,
      users,
      groupAdmin: req.user?._id,
    });

    const createdGroup = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({ groupChat: createdGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error: Failed to create group!" });
  }
}

async function addToGroup(req: AuthRequest, res: Response) {
  const { chatId, userId }: { chatId: string; userId: string } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.groupAdmin?.toString() !== req.user?._id.toString()) {
      res
        .status(403)
        .json({ message: "Forbidden: Only group admins can add members!" });
    }

    const userExists = chat.users.some((id) => id.toString() === userId);

    if (userExists) {
      res.status(400).json({ message: "User already in the group!" });
      return;
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email")
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const io: Socket = req.app.get("io");
    updatedChat?.users.forEach((user) => {
      io.to(user._id.toString()).emit("user added", updatedChat);
    });

    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: Failed to update Chat!" });
    console.log(error.stack?.red.italic);
  }
}

async function removeFromGroup(req: AuthRequest, res: Response) {
  const { chatId, userId }: { chatId: string; userId: string } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (!chat.isGroupChat) {
      res.status(400).json({ message: "This is not a group chat!" });
      return;
    }

    if (chat.groupAdmin?.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        message: "You are not authorized to remove members from this group.",
      });
      return;
    }

    if (req.user?._id.toString() === userId) {
      res.status(400).json({
        message:
          "Admin cannot remove themselves from the group. Please assign a new admin first.",
      });
      return;
    }

    const isGroupAdmin = await Chat.findOne({
      $and: [{ _id: chatId }, { groupAdmin: req.user?._id }],
    });
    if (!isGroupAdmin) {
      res.status(401).json({
        message: "You are not authorized to add members to this group",
      });
      return;
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email")
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const io: Socket = req.app.get("io");
    updatedChat?.users.forEach((user) => {
      io.to(user._id.toString()).emit("user removed", updatedChat);
    });

    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: Failed to update Chat!" });
    console.log(error.stack.red.italic);
  }
}

export {
  accessChat,
  getUserChats,
  getChatById,
  createGroupChat,
  addToGroup,
  removeFromGroup,
};
