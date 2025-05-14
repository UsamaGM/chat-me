import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { validateBeforeSave: true, timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;

export type ChatType = {
  _id: mongoose.Types.ObjectId;
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
  groupAdmin: mongoose.Types.ObjectId;
};
