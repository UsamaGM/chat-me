import api from "@/config/api";
import {
  ChatContext,
  type ChatType,
  type MessageType,
  type ReactionType,
} from "./ChatContext";
import errorHandler from "@/config/errorHandler";
import { toast } from "react-toast";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import createSocket from "@/config/createSocket";
import { useAuth } from "@/hooks/useAuth";
import type { UserType } from "./AuthContext";

function ChatProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, UserType[]>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const socket = useRef<Socket | null>(null);

  const updateChats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get("/chat");
      if (response.status === 200) {
        setChats(response.data.chats);
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }, [isAuthenticated]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      updateChats();
    } else {
      setChats([]);
      setSelectedChat(null);
      setMessages([]);
      setTypingUsers({});
    }
  }, [isAuthenticated, updateChats]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setIsLoading(true);
      api
        .get(`/chat/${selectedChat._id}`)
        .then((response) => setMessages(response.data.queriedChat))
        .catch((error) => toast.error(errorHandler(error)))
        .finally(() => setIsLoading(false));
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Centralized socket management
  useEffect(() => {
    if (isAuthenticated) {
      socket.current = createSocket();
      const sock = socket.current;

      sock.on("chat-updated", (newMessage: MessageType) => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newMessage.chat._id
              ? { ...chat, latestMessage: newMessage }
              : chat
          )
        );

        if (selectedChat?._id === newMessage.chat._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      sock.on(
        "messageReaction",
        (payload: {
          type: "add" | "remove";
          chatId: string;
          messageId: string;
          reaction?: ReactionType;
          reactionId?: string;
        }) => {
          if (selectedChat?._id === payload.chatId) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                if (msg._id === payload.messageId) {
                  let newReactions = [...msg.reactions];
                  if (payload.type === "add" && payload.reaction) {
                    console.log(payload);
                    newReactions.push(payload.reaction);
                  } else if (payload.type === "remove" && payload.reactionId) {
                    // Remove the reaction by its ID
                    newReactions = newReactions.filter(
                      (r) => r._id !== payload.reactionId
                    );
                  }
                  return { ...msg, reactions: newReactions };
                }
                return msg;
              })
            );
          }
        }
      );

      sock.on("user-typing", ({ chatId, userId }) => {
        const userTyping = chats
          .flatMap((c) => c.users)
          .find((u) => u._id === userId);
        if (userTyping) {
          setTypingUsers((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), userTyping].filter(
              (u, i, self) => i === self.findIndex((t) => t._id === u._id)
            ),
          }));
        }
      });

      sock.on("user-stopped-typing", ({ chatId, userId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || []).filter((u) => u._id !== userId),
        }));
      });

      // Add other listeners like message reactions if needed

      return () => {
        sock.disconnect();
      };
    }
  }, [isAuthenticated, chats, selectedChat?._id]);

  // Effect for joining and leaving socket rooms
  useEffect(() => {
    if (socket.current && selectedChat) {
      socket.current.emit("join-chat", selectedChat._id);
      return () => {
        socket.current?.emit("leave-chat", selectedChat._id);
      };
    }
  }, [selectedChat]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedChat || !content.trim() || !socket.current) return;
      try {
        const response = await api.post("/message", {
          // Corrected endpoint
          content: content.trim(),
          chat: selectedChat._id,
        });

        if (response.status === 200) {
          socket.current.emit("message", response.data.newMessage); // Corrected event name
          socket.current.emit("typing-stop", {
            chatId: selectedChat._id,
            userId: user?._id,
          });
        }
      } catch (error) {
        toast.error(errorHandler(error));
      }
    },
    [selectedChat, user?._id]
  );

  const contextValue = {
    isLoading,
    chats,
    selectedChat,
    socket: socket.current,
    messages,
    typingUsers,
    setSelectedChat,
    updateChats,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export default ChatProvider;
