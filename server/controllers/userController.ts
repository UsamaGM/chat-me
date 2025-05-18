import generateToken from "../config/generateToken";
import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";

async function registerUser(req: Request, res: Response) {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields" });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne<UserType>({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
}

async function searchUsers(req: AuthRequest, res: Response) {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  console.log(req.user);
  const users = await User.find(query).find({ _id: { $ne: req.user?._id } });

  res.send(users);
}

async function getUserProfile(req: AuthRequest, res: Response) {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
}

export { registerUser, loginUser, searchUsers, getUserProfile };
