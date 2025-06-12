import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import { useChat } from "@/hooks/useChat";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toast";

function MessageInputAndSendButton() {
  const { selectedChat, socket } = useChat();
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!chatMessage.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    try {
      const response = await api.post("/message", {
        content: chatMessage.trim(),
        chat: selectedChat._id,
      });
      const { newMessage } = response.data;

      // Emit the message event
      socket?.emit("message", newMessage);

      // Reset message and stop typing indicator
      setChatMessage("");
      socket?.emit("stop-typing", { chatId: selectedChat._id });

      // Focus back on input
      inputRef.current?.focus();
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsSending(false);
    }
  };

  // Handle typing with debounce
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);

    if (!selectedChat) return;

    // Emit typing event
    socket?.emit("typing", { chatId: selectedChat._id });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop-typing", { chatId: selectedChat._id });
    }, 3000);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing when component unmounts
      if (selectedChat) {
        socket?.emit("stop-typing", { chatId: selectedChat._id });
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
