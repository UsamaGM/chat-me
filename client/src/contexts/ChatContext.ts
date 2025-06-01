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
}

export interface ChatContextType {
  chats: ChatType[];
  selectedChat: ChatType | null;
  socket: Socket | null;
  setSelectedChat: (chat: ChatType) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);
