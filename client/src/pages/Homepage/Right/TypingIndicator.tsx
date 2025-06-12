import { type UserType } from "@/contexts/AuthContext";

interface TypingIndicatorProps {
  typingUser: UserType | undefined;
}

/**
 * Typing indicator component that shows when a user is typing
 * Uses custom animations defined in the tailwind.config.js
 */
function TypingIndicator({ typingUser }: TypingIndicatorProps) {
  if (!typingUser) return null;

  return (
    <div className="flex items-center text-sm text-blue-600/70 ml-2 animate-fadeIn bg-blue-50/30 px-3 py-1.5 rounded-full self-start shadow-sm">
      <div className="flex space-x-1 mr-2">
        <div className="w-2 h-2 rounded-full bg-blue-400/70 animate-typing1" />
        <div className="w-2 h-2 rounded-full bg-blue-400/70 animate-typing2" />
        <div className="w-2 h-2 rounded-full bg-blue-400/70 animate-typing3" />
      </div>
      <span className="font-medium">{typingUser.name} is typing...</span>
    </div>
  );
}

export default TypingIndicator;
