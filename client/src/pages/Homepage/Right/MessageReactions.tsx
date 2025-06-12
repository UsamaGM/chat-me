import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/config/api";
import { toast } from "react-toast";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import errorHandler from "@/config/errorHandler";
import type { MessageType, ReactionType } from "@/types/chat";

// Common emoji reactions
const COMMON_REACTIONS = ["👍", "❤️", "😊", "😂", "👏", "🎉"];

interface MessageReactionsProps {
  message: MessageType;
  align?: "left" | "right";
}

function MessageReactions({ message, align = "left" }: MessageReactionsProps) {
  const { user } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Group reactions by emoji for display
  const reactionGroups = message.reactions.reduce(
    (acc, reaction: ReactionType) => {
      const key = reaction.emoji;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(reaction);
      return acc;
    },
    {} as Record<string, typeof message.reactions>
  );

  // Handle clicking outside emoji picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add a reaction to the message
  const handleAddReaction = async (emoji: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await api.post("/message/reactions", {
        messageId: message._id,
        emoji,
      });
      setShowPicker(false);
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a reaction from the message
  const handleRemoveReaction = async (reactionId: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await api.delete("/message/reactions", {
        data: {
          messageId: message._id,
          reactionId,
        },
      });
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex items-center gap-1 mt-1 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {/* Display existing reactions */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(reactionGroups).map(([emoji, reactions]) => {
          // Check if current user has already reacted with this emoji
          const userReaction = reactions.find((r: ReactionType) => {
            return r.userId._id.toString() === user?._id.toString();
          });

          return (
            <button
              key={emoji}
              onClick={() => {
                if (userReaction) {
                  handleRemoveReaction(userReaction._id.toString());
                } else {
                  handleAddReaction(emoji);
                }
              }}
              disabled={isLoading}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs
                transition-all duration-200 ${
                  userReaction
                    ? "bg-blue-700/20 text-blue-600 hover:bg-blue-700/30"
                    : "bg-white/30 backdrop-blur-sm hover:bg-white/50 text-gray-600"
                } ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              title={reactions
                .map((r: ReactionType) => r.userId.name)
                .join(", ")}
            >
              <span>{emoji}</span>
              <span className="min-w-[1rem] text-center">
                {reactions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add reaction button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        disabled={isLoading}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          isLoading
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-400 hover:text-gray-600 hover:bg-white/30 hover:scale-110"
        }`}
        title="Add reaction"
      >
        <FaceSmileIcon className="w-4 h-4 text-white" />
      </button>

      {/* Emoji picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } bottom-full mb-2 p-2 bg-white/70 backdrop-blur-md rounded-xl shadow-lg 
          flex gap-1 z-10 border border-gray-100 animate-fadeIn`}
        >
          {COMMON_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleAddReaction(emoji)}
              disabled={isLoading}
              className={`p-2 rounded-lg text-lg transition-all duration-200 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/50 hover:scale-110"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageReactions;
