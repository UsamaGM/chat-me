import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useEffect, useRef } from "react";
import MessageInputAndSendButton from "./MessageInputAndSendButton";
import UsernameWithEmailAndAvatar from "../UsernameWithEmailAndAvatar";
import { Bars3Icon, PhoneIcon, ShareIcon } from "@heroicons/react/24/solid";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Loader } from "@/components";

function Chat() {
  const { user, logout } = useAuth();
  const { selectedChat, messages, typingUsers, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex flex-2/3 items-center justify-center">
        <p>Select a Chat to start conversation!</p>
      </div>
    );
  }

  const currentTypingUsers = typingUsers[selectedChat._id] || [];
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

          {currentTypingUsers.map((typingUser) => (
            <TypingIndicator key={typingUser._id} typingUser={typingUser} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="absolute px-6 w-full bottom-0 right-0 bg-white/30 pt-2">
          <MessageInputAndSendButton />
        </div>
      </div>
    </div>
  );
}

export default Chat;
