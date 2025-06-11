import generateToken from "../config/generateToken";
import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";
import crypto from "crypto";

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
    pic,
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
  const { search } = req.params;
  const query =
    search === "*"
      ? {}
      : {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        };

  const users = await User.find(query)
    .find({ _id: { $ne: req.user?._id } })
    .select("-password");

  res.json({ users });
}

async function getUserProfile(req: AuthRequest, res: Response) {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
}

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne<UserType>({ email });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await User.findByIdAndUpdate(user._id, { validateBeforeSave: false });

  // In a real application, you would send an email with the reset link
  console.log({ resetToken });

  res
    .status(200)
    .json({ message: "Reset token sent to email (check console)" });
}

async function resetPassword(req: Request, res: Response) {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne<UserType>({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ message: "Token is invalid or has expired" });
    return;
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await User.findByIdAndUpdate(user._id, user);

  res.status(200).json({ message: "Password reset successfully" });
}

export {
  registerUser,
  loginUser,
  searchUsers,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
