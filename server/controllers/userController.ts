import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import generateToken from "../config/generateToken";

async function registerUser(req: Request, res: Response) {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields" });
    return;
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  // Create new user
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
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
}

export { registerUser, loginUser };
