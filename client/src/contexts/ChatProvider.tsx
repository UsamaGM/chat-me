import api from "@/config/api";
import { ChatContext, type ChatType } from "./ChatContext";
import errorHandler from "@/config/errorHandler";
import { toast } from "react-toast";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  const socket = useRef<Socket | null>(null);

  const fetchChats = useCallback(async function () {
    try {
      console.log("Fetching chats...");
      const response = await api.get("/chat");
      setChats(response.data.chats);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:3000/", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.current.on("chat-updated", fetchChats);
    return () => {
      socket.current?.off();
    };
  }, [fetchChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  console.log("ChatProvider Updated");

  const contextValue = useMemo(
    () => ({
      chats,
      selectedChat,
      socket: socket.current,
      setSelectedChat,
    }),
    [chats, selectedChat]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export default ChatProvider;
