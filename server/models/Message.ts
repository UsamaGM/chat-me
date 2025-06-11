import mongoose from "mongoose";
import { UserType } from "./User";

// Define interface for reaction
export interface ReactionType {
  _id: mongoose.Types.ObjectId;
  emoji: string;
  userId: mongoose.Types.ObjectId | UserType;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for reactions
const ReactionSchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          // Basic emoji validation - typically emoji are 1-2 characters
          return v.length >= 1 && v.length <= 4;
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid emoji`,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: [ReactionSchema], // Add reactions array field
  },
  { timestamps: true }
);

// Pre-save hook to automatically add sender to seenBy array
MessageSchema.pre("save", function (next) {
  // If this is a new message and sender is not already in seenBy
  if (this.isNew && !this.seenBy.includes(this.sender!)) {
    this.seenBy.push(this.sender!);
  }
  next();
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;

export type MessageType = {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  chat: mongoose.Types.ObjectId;
  seenBy: mongoose.Types.ObjectId[];
  reactions: ReactionType[]; // Add reactions to type
  createdAt: Date;
  updatedAt: Date;
};

// Type for populated message with user details
export type PopulatedMessageType = Omit<
  MessageType,
  "sender" | "chat" | "seenBy"
> & {
  sender: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    pic: string;
  };
  chat: {
    _id: mongoose.Types.ObjectId;
    chatName: string;
    isGroupChat: boolean;
    users: mongoose.Types.ObjectId[];
  };
  seenBy: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    pic: string;
  }>;
  reactions: Array<
    Omit<ReactionType, "userId"> & {
      userId: {
        _id: mongoose.Types.ObjectId;
        name: string;
        email: string;
        pic: string;
      };
    }
  >;
};
