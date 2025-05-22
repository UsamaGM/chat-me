import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import { Loader } from "@/components";
import type { MessageType } from "@/contexts/ChatContext";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";
import MessageInputAndSendButton from "./MessageInputAndSendButton";

function Chat() {
  const { user } = useAuth();
  const { selectedChat } = useChat();

  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageType[]>([]);

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

  return (
    <div className="relative flex flex-col h-full p-6 space-y-4">
      <div className="h-full space-y-2 overflow-y-auto">
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
          <p>Start typing yaaar! No conversations yet 😕</p>
        )}
      </div>
      <MessageInputAndSendButton
        addMessage={(message: MessageType) =>
          setMessages([...messages, message])
        }
      />
    </div>
  );
}

export default Chat;
