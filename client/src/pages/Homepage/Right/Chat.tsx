import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import MessageInputAndSendButton from "./MessageInputAndSendButton";
import UsernameWithEmailAndAvatar from "../UsernameWithEmailAndAvatar";
import {
  Bars3Icon,
  Cog6ToothIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Loader } from "@/components";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { ChatType, MessageType, ReactionType } from "@/types/chat";
import type { UserType } from "@/contexts/AuthContext";
import GroupSettingsModal from "./GroupSettingsModal";

function Chat() {
  const loaderData = useLoaderData() as {
    data: { queriedChat: MessageType[] };
  };

  const [typingUsers, setTypingUsers] = useState<UserType[]>([]);
  const [messages, setMessages] = useState(loaderData?.data?.queriedChat || []);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  const { user, logout } = useAuth();
  const { id: chatId } = useParams();
  const { chats, socket, updateChats } = useOutletContext<{
    chats: ChatType[];
    socket: Socket | null;
    updateChats: () => Promise<void>;
  }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(loaderData?.data?.queriedChat || []);
  }, [loaderData]);

  const selectedChat = chats.find((c) => c._id === chatId);
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("join-chat", selectedChat._id);

      const onNewMessage = (newMessage: MessageType) => {
        if (newMessage.chat._id === selectedChat._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      function onUserTyping({
        chatId: eventChatId,
        userId,
      }: {
        chatId: string;
        userId: string;
      }) {
        if (eventChatId === selectedChat?._id && userId !== user?._id) {
          // Find the full user object from the current chat's user list
          const typingUserInfo = selectedChat.users.find(
            (u) => u._id === userId
          );
          if (typingUserInfo) {
            setTypingUsers((prev) => {
              if (prev.find((u) => u._id === typingUserInfo._id)) return prev;
              return [...prev, typingUserInfo];
            });
          }
        }
      }

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

      function onMessageReadUpdate(payload: {
        messageId: string;
        seenBy: UserType;
      }) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === payload.messageId
              ? { ...message, seenBy: [...message.seenBy, payload.seenBy] }
              : message
          )
        );
      }

      const onMessageReaction = (payload: {
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
                  if (
                    !newReactions.some((r) => r._id === payload.reaction?._id)
                  ) {
                    newReactions.push(payload.reaction);
                  }
                } else if (payload.type === "remove" && payload.reactionId) {
                  newReactions = newReactions.filter(
                    (r) => r._id.toString() !== payload.reactionId
                  );
                }
                return { ...msg, reactions: newReactions };
              }
              return msg;
            })
          );
        }
      };

      socket.on("chat-updated", onNewMessage);
      socket.on("user-typing", onUserTyping);
      socket.on("user-stopped-typing", onUserStoppedTyping);
      socket.on("message-read-update", onMessageReadUpdate);
      socket.on("messageReaction", onMessageReaction);

      return () => {
        socket.emit("leave-chat", selectedChat._id);
        socket.off("chat-updated", onNewMessage);
        socket.off("user-typing", onUserTyping);
        socket.off("user-stopped-typing", onUserStoppedTyping);
        socket.off("messageReaction", onMessageReaction);
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
  const chatTitle = selectedChat.isGroupChat
    ? selectedChat.chatName
    : selectedChat.users.find((u) => u._id !== user?._id)?.name;
  const chatSubtitle = selectedChat.isGroupChat
    ? selectedChat.users.reduce(
        (a, u) => (u._id === user?._id ? a + "You " : a + u.name + " "),
        ""
      )
    : otherUser?.email;
  const chatPic = selectedChat.isGroupChat ? undefined : otherUser?.pic;
  const isAdmin =
    selectedChat.isGroupChat && selectedChat.groupAdmin._id === user?._id;

  return (
    <div className="relative flex flex-col flex-2/3 bg-white/30 rounded-3xl">
      <div className="p-6 border-b border-white/20">
        <UsernameWithEmailAndAvatar
          title={chatTitle}
          subtitle={chatSubtitle}
          pic={chatPic}
          rightIcons={
            <>
              <PhoneIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              <ShareIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              {isAdmin && (
                <button onClick={() => setShowGroupSettings(true)}>
                  <Cog6ToothIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
                </button>
              )}
              <button onClick={logout}>
                <Bars3Icon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              </button>
            </>
          }
        />
      </div>

      <div className="relative w-full h-full overflow-hidden px-6">
        <div className="flex flex-col space-y-2 overflow-y-auto h-full pb-24 pt-4">
          {!loaderData ? (
            <Loader />
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isGroupChat={selectedChat.isGroupChat}
              />
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

      {showGroupSettings && selectedChat && (
        <GroupSettingsModal
          chat={selectedChat}
          onClose={() => setShowGroupSettings(false)}
          updateChats={updateChats}
        />
      )}
    </div>
  );
}

export default Chat;
