import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import MessageInputAndSendButton from "./MessageInputAndSendButton";
import UsernameWithEmailAndAvatar from "../UsernameWithEmailAndAvatar";
import { Bars3Icon, PhoneIcon, ShareIcon } from "@heroicons/react/24/solid";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Loader } from "@/components";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { ChatType, MessageType } from "@/types/chat";
import { toast } from "react-toast";
import api from "@/config/api";
import errorHandler from "@/config/errorHandler";
import type { UserType } from "@/contexts/AuthContext";

function Chat() {
  const { user, logout } = useAuth();
  const { id: chatId } = useParams<{ id: string }>();
  const { chats, socket } = useOutletContext<{
    chats: ChatType[];
    socket: Socket | null;
  }>();
  const loaderData = useLoaderData() as {
    data: { queriedChat: MessageType[] };
  };

  const [messages, setMessages] = useState<MessageType[]>(
    loaderData?.data?.queriedChat || []
  );
  const [typingUsers, setTypingUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(!loaderData);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c._id === chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatId && !loaderData) {
      setIsLoading(true);
      api
        .get(`/chat/${chatId}`)
        .then((res) => setMessages(res.data.queriedChat))
        .catch((err) => toast.error(errorHandler(err)))
        .finally(() => setIsLoading(false));
    }
  }, [chatId, loaderData]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("join-chat", selectedChat._id);

      const onNewMessage = (newMessage: MessageType) => {
        if (newMessage.chat._id === selectedChat._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      const onUserTyping = ({
        chatId: eventChatId,
        user: typingUserInfo,
      }: {
        chatId: string;
        user: UserType;
      }) => {
        if (
          eventChatId === selectedChat._id &&
          typingUserInfo._id !== user?._id
        ) {
          setTypingUsers((prev) => {
            if (prev.find((u) => u._id === typingUserInfo._id)) return prev;
            return [...prev, typingUserInfo];
          });
        }
      };

      const onUserStoppedTyping = ({
        chatId: eventChatId,
        userId,
      }: {
        chatId: string;
        userId: string;
      }) => {
        if (eventChatId === selectedChat._id) {
          setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
        }
      };

      socket.on("chat-updated", onNewMessage);
      socket.on("user-typing", onUserTyping);
      socket.on("user-stopped-typing", onUserStoppedTyping);

      return () => {
        socket.emit("leave-chat", selectedChat._id);
        socket.off("chat-updated", onNewMessage);
        socket.off("user-typing", onUserTyping);
        socket.off("user-stopped-typing", onUserStoppedTyping);
      };
    }
  }, [socket, selectedChat, user?._id]);

  if (!selectedChat) {
    return (
      <div className="flex flex-2/3 items-center justify-center">
        <p>Select a Chat to start conversation!</p>
      </div>
    );
  }

  const otherUser = selectedChat.users.find((u) => u._id !== user?._id);

  return (
    <div className="relative flex flex-col flex-2/3 bg-white/30 rounded-3xl">
      <div className="p-6 border-b border-white/20">
        <UsernameWithEmailAndAvatar
          user={otherUser!}
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

      <div className="relative w-full h-full overflow-hidden px-6">
        <div className="flex flex-col space-y-2 overflow-y-auto h-full pb-24 pt-4">
          {isLoading ? (
            <Loader />
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))
          ) : (
            <p className="text-center my-4 text-gray-500">
              No messages yet. Say hello! 👋
            </p>
          )}

          {typingUsers.map((typingUser) => (
            <TypingIndicator key={typingUser._id} typingUser={typingUser} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="absolute px-6 w-full bottom-0 right-0 bg-white/30 pt-2">
          <MessageInputAndSendButton selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
