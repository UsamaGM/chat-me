import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Chat from "../models/Chat";
import User from "../models/User";

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
  console.log("Existing Chat", existingChat);

  existingChat = await User.populate(existingChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (existingChat) {
    res.status(200).json({ chat: existingChat });
    console.log("Chat existed already!");
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
      .populate("latestMessage")
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

async function createGroupChat(req: AuthRequest, res: Response) {
  const { chatName, users }: { chatName: string; users: [string] } = req.body;
  users.push(req.user?._id.toString()!);

  try {
    const groupChat = await Chat.create({
      chatName,
      users,
      groupAdmin: req.user?._id,
    });

    const createdGroup = await Chat.findById(groupChat._id);

    res.status(200).json({ groupChat: createdGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error: Failed to create group!" });
  }
}

async function addToGroup(req: AuthRequest, res: Response) {}

async function removeFromGroup(req: AuthRequest, res: Response) {}

export {
  accessChat,
  getUserChats,
  createGroupChat,
  addToGroup,
  removeFromGroup,
};
