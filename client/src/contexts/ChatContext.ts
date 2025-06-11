import { createContext } from "react";
import type { UserType } from "./AuthProvider";
import type { Socket } from "socket.io-client";

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

/**
 * Payload for socket events related to read receipts
 */
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

export interface ChatContextType {
  isLoading: boolean;
  chats: ChatType[];
  selectedChat: ChatType | null;
  socket: Socket | null;
  messages: MessageType[];
  typingUsers: Record<string, UserType[]>;
  setSelectedChat: (chat: ChatType) => void;
  updateChats: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);
