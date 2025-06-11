import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { type MessageType } from "@/contexts/ChatContext";
import { format } from "date-fns";
import { useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import MessageReactions from "./MessageReactions";

interface MessageBubbleProps {
  message: MessageType & {
    reactions?: Array<{
      _id: string;
      emoji: string;
      userId: {
        _id: string;
        name: string;
        pic?: string;
      };
    }>;
  };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const { markMessageAsRead } = useChat();
  const isOwnMessage = message.sender._id === user?._id;

  // Mark message as read when it's displayed (if it's not the user's own message)
  useEffect(() => {
    if (
      !isOwnMessage &&
      message.seenBy &&
      !message.seenBy.some((u) => u._id === user?._id)
    ) {
      markMessageAsRead?.(message._id);
    }
  }, [isOwnMessage, message, markMessageAsRead, user?._id]);

  return (
    <div
      className={`flex flex-col ${
        isOwnMessage ? "items-end" : "items-start"
      } mb-4 animate-fadeIn`}
    >
      <div
        className={`flex items-end gap-2 ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={message.sender.pic || "https://via.placeholder.com/40"}
            alt={message.sender.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Message Content */}
        <div
          className={`relative px-4 py-2 rounded-2xl max-w-[70%] ${
            isOwnMessage
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          {/* Sender name for group chats */}
          {message.chat.isGroupChat && !isOwnMessage && (
            <div className="text-xs font-medium mb-1 text-blue-600">
              {message.sender.name}
            </div>
          )}

          {/* Message text */}
          <p className="text-sm">{message.content}</p>

          {/* Message timestamp */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span
              className={`text-xs ${
                isOwnMessage ? "text-white/70" : "text-gray-500"
              }`}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          </div>
        </div>
        {/* Message Reactions */}
        <MessageReactions
          message={message}
          align={isOwnMessage ? "right" : "left"}
        />
      </div>

      {/* Read receipts - only show for own messages */}
      {isOwnMessage && message.seenBy && (
        <div className="flex mt-1">
          {message.seenBy.length <= 1 ? (
            <span className="text-xs text-gray-500 mr-2 flex items-center">
              <CheckIcon className="w-3 h-3 mr-1" />
              Sent
            </span>
          ) : (
            <div className="flex -space-x-1 items-center">
              <CheckCircleIcon className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-xs text-gray-500 mr-1">
                Read by {message.seenBy.length - 1}
              </span>
              {message.seenBy
                .filter((seenUser) => seenUser._id !== user?._id)
                .slice(0, 3)
                .map((seenUser) => (
                  <div
                    key={seenUser._id}
                    className="w-5 h-5 rounded-full border-2 border-white overflow-hidden"
                    title={`Seen by ${seenUser.name}`}
                  >
                    <img
                      src={seenUser.pic || "https://via.placeholder.com/20"}
                      alt={seenUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              {message.seenBy.length > 4 && (
                <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  +{message.seenBy.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
