import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import { Loader } from "@/components";
import type { MessageType } from "@/contexts/ChatContext";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useRef, useState } from "react";

function Chat() {
  const { user } = useAuth();
  const { selectedChat } = useChat();

  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChat();
    async function fetchChat() {
      try {
        setLoading(true);
        const response = await api.get(`/chat/${selectedChat?._id}`);
        setMessages(response.data.queriedChat);
      } catch (error) {
        toast.error(errorHandler(error));
      } finally {
        setLoading(false);
      }
    }
  }, [selectedChat]);

  if (loading) return <Loader size="large" />;

  //TODO: Implement Messaging functionality
  //   async function sendMessage(e: KeyboardEvent) {
  //     if (e.key === "Enter") {
  //       const message = (e.target as HTMLInputElement).value;
  //       if (message) {
  //         // setMessages([
  //         //   ...messages,
  //         //   { sender: "John Cloe", message, time: "12:05 PM" },
  //         // ]);
  //         // chatEndRef.current?.scrollIntoView({
  //         //   behavior: "smooth",
  //         // });
  //         // (e.target as HTMLInputElement).value = "";
  //       }
  //     }
  //   }

  return (
    <div className="flex flex-col grow p-6 overflow-y-auto space-y-2">
      {messages.length ? (
        messages.map((message, index) => {
          const isSameUserMessage = message.sender._id === user?._id;
          return (
            <div
              key={index}
              className={`${
                isSameUserMessage ? "bg-blue-700/15" : "bg-green-700/15"
              } backdrop-blur-md rounded-3xl px-4 py-2 space-y-1 max-w-2/3 w-fit text-wrap ${
                isSameUserMessage ? "self-start" : "self-end"
              }`}
            >
              <p
                className={
                  isSameUserMessage
                    ? "text-blue-700 text-wrap overflow-ellipsis"
                    : "text-green-700 text-wrap overflow-ellipsis"
                }
              >
                {message.content}
              </p>
              <p className="text-xs place-self-end">{message.updatedAt}</p>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center">
          <p>Start typing yaaar! No conversations yet 😕</p>
        </div>
      )}
      <div ref={chatEndRef} className="h-0" />
      <div className="flex items-center justify-between p-6 rounded-b-3xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-4 bg-white/30 rounded-3xl border border-blue-700/20 focus:outline-none focus:ring focus:ring-blue-700/50"
          //   onKeyDown={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
