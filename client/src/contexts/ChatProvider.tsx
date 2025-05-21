import api from "@/config/api";
import { ChatContext, type ChatType } from "./ChatContext";
import errorHandler from "@/config/errorHandler";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, type ReactNode } from "react";

function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  useEffect(() => {
    fetchChats();
    async function fetchChats() {
      try {
        setLoading(true);
        const response = await api.get("/chat");
        setChats(response.data.chats);
      } catch (error) {
        toast.error(errorHandler(error));
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ loading, chats, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
