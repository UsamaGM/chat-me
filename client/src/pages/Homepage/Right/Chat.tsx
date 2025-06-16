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
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { ChatType, MessageType, ReactionType } from "@/types/chat";
import type { UserType } from "@/contexts/AuthContext";
import GroupSettingsModal from "./GroupSettingsModal";

function Chat() {
  const loaderData = useLoaderData() as {
    data: { queriedChat: MessageType[] };
  };
  const { selectedChat, socket } = useOutletContext<{
    selectedChat: ChatType | null;
    socket: Socket | null;
  }>();
  console.log("Selected Chat", selectedChat);

  const [chat, setChat] = useState<ChatType | null>(selectedChat);
  const [typingUsers, setTypingUsers] = useState<UserType[]>([]);
  const [messages, setMessages] = useState(loaderData?.data?.queriedChat || []);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChat) {
      setChat(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(loaderData?.data?.queriedChat || []);
  }, [loaderData]);

  useEffect(() => {
    if (socket && chat) {
      socket.emit("join-chat", chat._id);

      const onNewMessage = (newMessage: MessageType) => {
        console.log("New Message", newMessage);
        if (newMessage.chat._id === chat._id) {
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
        if (eventChatId === chat?._id && userId !== user?._id) {
          const typingUserInfo = chat.users.find((u) => u._id === userId);
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
        if (eventChatId === chat._id) {
          setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
        }
      };

      function onMessageReadUpdate(payload: {
        messageId: string;
        seenBy: UserType;
      }) {
        console.log("Message read update:", payload);
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
        console.log("New Message Reaction");
        if (chat?._id === payload.chatId) {
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

      const onUserAdded = (updatedChat: ChatType) => {
        if (updatedChat._id === chat._id) {
          setChat(updatedChat);
        }
      };

      const onUserRemoved = (updatedChat: ChatType) => {
        if (updatedChat._id === chat._id) {
          if (!updatedChat.users.some((u) => u._id === user?._id)) {
            navigate("/home");
          } else {
            setChat(updatedChat);
          }
        }
      };

      socket.on("new message", onNewMessage);
      socket.on("user started typing", onUserTyping);
      socket.on("user stopped typing", onUserStoppedTyping);
      socket.on("message-read-update", onMessageReadUpdate);
      socket.on("messageReaction", onMessageReaction);
      socket.on("user added", onUserAdded);
      socket.on("user removed", onUserRemoved);

      return () => {
        socket.emit("leave-chat", chat._id);
        socket.off("new message", onNewMessage);
        socket.off("user started typing", onUserTyping);
        socket.off("user stopped typing", onUserStoppedTyping);
        socket.off("messageReaction", onMessageReaction);
        socket.off("user added", onUserAdded);
        socket.off("user removed", onUserRemoved);
      };
    }
  }, [socket, chat, user?._id, navigate, loaderData]);

  if (!chat) {
    return (
      <div className="flex flex-2/3 items-center justify-center">
        <p>Select a Chat to start conversation!</p>
      </div>
    );
  }

  const otherUser = chat.users.find((u) => u._id !== user?._id);
  const chatTitle = chat.isGroupChat ? chat.chatName : otherUser?.name;
  const chatSubtitle = chat.isGroupChat
    ? chat.users.map((u) => (u._id === user?._id ? "You" : u.name)).join(", ")
    : otherUser?.email;
  const chatPic = chat.isGroupChat ? undefined : otherUser?.pic;
  const isAdmin = chat.isGroupChat && chat.groupAdmin._id === user?._id;

  return (
    <div className="relative flex flex-col flex-2/3 bg-white/30 rounded-3xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/20">
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

      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex flex-col space-y-2 overflow-y-auto h-full px-6 pt-4">
          {!loaderData ? (
            <Loader />
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isGroupChat={chat.isGroupChat}
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

        <div className="flex-1/12 px-6 w-full bg-white/20">
          <MessageInputAndSendButton selectedChat={chat} />
        </div>
      </div>

      {showGroupSettings && chat && (
        <GroupSettingsModal
          chat={chat}
          onClose={() => setShowGroupSettings(false)}
        />
      )}
    </div>
  );
}

export default Chat;
