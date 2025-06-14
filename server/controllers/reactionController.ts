import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message, { ReactionType } from "../models/Message";
import { Server } from "socket.io";

// Interface for reaction socket event payload
export interface ReactionEventPayload {
  type: "add" | "remove";
  chatId: string;
  messageId: string;
  reaction?: ReactionType | undefined;
  reactionId?: string;
}

export async function addReaction(req: AuthRequest, res: Response) {
  const { messageId, emoji } = req.body;

  // Validation
  if (!messageId || !emoji) {
    return res.status(400).json({
      success: false,
      message: "Message ID and emoji are required",
    });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user has already reacted with this emoji
    const existingReaction = message.reactions.findIndex(
      (reaction) => reaction.userId.toString() === req.user?._id.toString()
    );

    if (existingReaction !== -1) {
      return res.status(400).json({
        success: false,
        message: "You have already used this reaction",
      });
    }

    // Add new reaction
    message.reactions.push({
      emoji,
      userId: req.user?._id,
    });

    await message.save();

    // Get populated message
    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name email pic")
      .populate("chat")
      .populate("seenBy", "name email pic")
      .populate("reactions.userId", "name email pic");

    // Emit socket event for real-time updates
    const io: Server = req.app.get("io");
    const newReaction =
      updatedMessage?.reactions[updatedMessage?.reactions.length - 1];
    const payload: ReactionEventPayload = {
      type: "add",
      chatId: message.chat!._id.toString(),
      messageId: message._id.toString(),
      reaction: newReaction,
    };

    io.to(message.chat!.toString()).emit("messageReaction", payload);

    // Send response
    res.status(200).json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to add reaction",
    });
  }
}

export async function removeReaction(req: AuthRequest, res: Response) {
  const { messageId, reactionId } = req.body;

  // Validation
  if (!messageId || !reactionId) {
    return res.status(400).json({
      success: false,
      message: "Message ID and reaction ID are required",
    });
  }

  try {
    // Find message and validate it exists
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Find the reaction and verify ownership
    const reactionIndex = message.reactions.findIndex(
      (reaction) =>
        reaction._id!.toString() === reactionId &&
        reaction.userId.toString() === req.user?._id.toString()
    );

    if (reactionIndex === -1) {
      return res.status(403).json({
        success: false,
        message: "Reaction not found or you are not authorized to remove it",
      });
    }

    // Remove reaction
    message.reactions.splice(reactionIndex, 1);
    await message.save();

    // Get populated message
    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name email pic")
      .populate("chat")
      .populate("seenBy", "name email pic")
      .populate("reactions.userId", "name email pic");

    // Emit socket event for real-time updates
    const io: Server = req.app.get("io");
    const payload: ReactionEventPayload = {
      type: "remove",
      chatId: message.chat!._id.toString(),
      messageId: message._id.toString(),
      reactionId,
    };

    io.to(message.chat!.toString()).emit("messageReaction", payload);

    // Send response
    res.status(200).json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to remove reaction",
    });
  }
}
