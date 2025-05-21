import { createContext } from "react";
import type { UserType } from "./AuthProvider";

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
  chat: string;
  content: string;
  createdAt: string;
  sender: UserType;
  updatedAt: string;
}

export interface ChatContextType {
  loading: boolean;
  chats: ChatType[];
  selectedChat: ChatType | null;
  setSelectedChat: (chat: ChatType) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);
