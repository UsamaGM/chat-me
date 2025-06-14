import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toast";
import { useOutletContext } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { ChatType } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";

interface PropTypes {
  selectedChat: ChatType;
}

function MessageInputAndSendButton({ selectedChat }: PropTypes) {
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { socket } = useOutletContext<{ socket: Socket | null }>();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    try {
      await api.post("/message", {
        chat: selectedChat._id,
        content: chatMessage.trim(),
      });

      setChatMessage("");
      socket?.emit("typing-stop", {
        chatId: selectedChat._id,
        userId: user?._id,
      });
      inputRef.current?.focus();
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
    if (!selectedChat || !socket) return;
    socket.emit("typing-start", {
      chatId: selectedChat._id,
      userId: user?._id,
    });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing-stop", {
        chatId: selectedChat._id,
        userId: user?._id,
      });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (selectedChat && socket) {
        socket.emit("stop-typing", { chatId: selectedChat._id });
      }
    };
  }, [selectedChat, socket]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between space-x-6 rounded-b-3xl my-4"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={chatMessage}
        onChange={handleTyping}
        disabled={isSending}
        className="w-full p-4 bg-white/30 rounded-3xl border border-blue-700/20 focus:outline-none focus:ring focus:ring-blue-700/50 disabled:opacity-75 transition-opacity"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={!chatMessage.trim() || isSending}
        className={`p-3 rounded-full ${
          chatMessage.trim() && !isSending
            ? "bg-blue-700/20 text-blue-600 hover:bg-blue-700/30"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        } transition-colors`}
      >
        <PaperAirplaneIcon
          width={16}
          height={16}
          className={
            isSending
              ? "animate-pulse"
              : "transform transition-transform hover:translate-x-1"
          }
        />
      </button>
    </form>
  );
}

export default MessageInputAndSendButton;
