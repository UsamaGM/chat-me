import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import type { MessageType } from "@/contexts/ChatContext";
import { useChat } from "@/hooks/useChat";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "react-toast";

interface PropTypes {
  addMessage: (message: MessageType) => void;
}

function MessageInputAndSendButton({ addMessage }: PropTypes) {
  const { selectedChat } = useChat();
  const [chatMessage, setChatMessage] = useState("");

  //TODO: Implement Messaging functionality
  async function sendMessage() {
    if (chatMessage.length) {
      try {
        const response = await api.post("/message", {
          content: chatMessage,
          chat: selectedChat?._id,
        });
        const { newMessage } = response.data;

        addMessage(newMessage);

        setChatMessage("");
      } catch (error) {
        toast.error(errorHandler(error));
      }
    }
  }

  return (
    <div className="flex items-center justify-between space-x-6 rounded-b-3xl">
      <input
        type="text"
        placeholder="Type a message..."
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        className="w-full p-4 bg-white/30 rounded-3xl border border-blue-700/20 focus:outline-none focus:ring focus:ring-blue-700/50"
      />
      <button onClick={sendMessage}>
        <PaperAirplaneIcon width={16} height={16} />
      </button>
    </div>
  );
}

export default MessageInputAndSendButton;
