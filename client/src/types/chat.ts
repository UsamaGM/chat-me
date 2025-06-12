import type { UserType } from "@/contexts/AuthContext";

export interface ChatType {
  _id: string;
  chatName: string;
  createdAt: string;
  groupAdmin: string;
  isGroupChat: boolean;
  latestMessage?: MessageType;
  updatedAt: string;
  users: UserType[];
}

export interface MessageType {
  _id: string;
  chat: ChatType;
  content: string;
  createdAt: string;
  sender: UserType;
  updatedAt: string;
  seenBy: UserType[];
  reactions: ReactionType[];
}

export interface ReactionType {
  _id: string;
  emoji: string;
  userId: UserType;
  createdAt: string;
}

export interface ReadReceiptPayload {
  messageId: string;
  userId: string;
  chatId: string;
}

export interface ReactionEventPayload {
  reactionId: string;
  chatId: string;
  messageId: string;
  type: string;
  reaction: {
    emoji: string;
    userId: string;
  };
}
