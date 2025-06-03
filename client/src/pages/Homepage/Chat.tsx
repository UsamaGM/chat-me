import errorHandler from "@/config/errorHandler";
import type { ChatType, MessageType } from "@/contexts/ChatContext";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";
import MessageInputAndSendButton from "./MessageInputAndSendButton";
import { useLoaderData } from "react-router-dom";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";
import { Bars3Icon, PhoneIcon, ShareIcon } from "@heroicons/react/24/solid";
import type { UserType } from "@/contexts/AuthProvider";
import { io } from "socket.io-client";
import formatDateTime from "@/config/formatter";

function Chat() {
  const { user, logout } = useAuth();
  const { selectedChat } = useChat();

  if (!selectedChat) return null;

  console.log("Chat is redering...");

  return (
    <div className="flex flex-col flex-2/3 bg-white/30 rounded-3xl">
      <div className="p-6">
        <UsernameWithEmailAndAvatar
          user={selectedChat.users.find((u) => u._id != user?._id)!}
          rightIcons={
            <>
              <PhoneIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              <ShareIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              <button onClick={logout}>
                <Bars3Icon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              </button>
            </>
          }
        />
      </div>
      <ChatMessagesList chat={selectedChat} user={user} />
    </div>
  );
}

function ChatMessagesList({
  chat,
  user,
}: {
  chat: ChatType;
  user: UserType | null;
}) {
  const response = useLoaderData();

  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (response.status === 200) setMessages(response.data.queriedChat);
    else toast.error(errorHandler(response.error));
  }, [response]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.emit("join-chat", chat?._id);

    socket.on("chat-updated", (latestMessage: MessageType) => {
      console.log(latestMessage);
      if (latestMessage.sender._id !== user?._id)
        toast.info(`${latestMessage.sender.name}: ${latestMessage.content}`);

      if (chat?._id === latestMessage.chat._id) {
        setMessages((prevMessages) => [...prevMessages, latestMessage]);
      }
    });

    socket.on("chat-deleted", (deletedChatId: string) => {
      if (chat?._id === deletedChatId) {
        setMessages([]);
        toast.info("This chat has been deleted.");
      }
    });

    return () => {
      if (socket) {
        socket.emit("leave-chat", chat?._id);
        socket.off();
      }
    };
  }, [chat, user]);

  return (
    <div className="flex flex-col h-full overflow-hidden px-6">
      <div className="space-y-2 overflow-y-auto h-full">
        {messages.length ? (
          messages.map((message, index) => {
            const isSameUserMessage = message.sender._id === user?._id;
            const { day, time, isToday } = formatDateTime(message.updatedAt);

            return (
              <div
                key={index}
                className={`${
                  isSameUserMessage ? "bg-green-700/25" : "bg-blue-700/25"
                } backdrop-blur-md rounded-3xl px-4 py-2 space-y-1 max-w-2/3 w-fit text-wrap ${
                  isSameUserMessage ? "place-self-end" : ""
                }`}
              >
                <p
                  className={
                    isSameUserMessage
                      ? "text-green-700 text-wrap overflow-ellipsis"
                      : "text-blue-700 text-wrap overflow-ellipsis"
                  }
                >
                  {message.content}
                </p>
                <p className="text-xs place-self-end">
                  {isToday ? time : `${day}, ${time}`}
                </p>
              </div>
            );
          })
        ) : (
          <p>Start typing yaaar! No conversations yet 😕</p>
        )}
      </div>
      <div className=" bottom-0 right-0">
        <MessageInputAndSendButton />
      </div>
    </div>
  );
}

export default Chat;
