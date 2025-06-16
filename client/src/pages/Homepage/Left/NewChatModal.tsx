import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import React, { useState, type ReactNode } from "react";

function NewChatModal({
  toggleChatModals,
}: {
  toggleChatModals: (value: "p2p" | "group") => void;
}) {
  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowChatModal(true)}
      onMouseLeave={() => setShowChatModal(false)}
      className="absolute bottom-6 right-6 z-10"
    >
      {/* New Chat Modal */}
      {showChatModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 mb-3 animate-fade-in"
        >
          <OptionButton
            className="animate-slide-in-delayed opacity-0"
            onClick={() => toggleChatModals("p2p")}
          >
            P2P
            <UserIcon className="size-6" />
          </OptionButton>
          <OptionButton
            className="animate-slide-in"
            onClick={() => toggleChatModals("group")}
          >
            Group
            <UserGroupIcon className="size-6" />
          </OptionButton>
        </div>
      )}

      {/* New Chat Button */}
      <OptionButton>
        New Chat <ChatBubbleLeftRightIcon className="size-10" />
      </OptionButton>
    </div>
  );
}

const OptionButton = React.memo(
  ({
    className,
    children,
    onClick,
  }: {
    className?: string;
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 pl-2 cursor-pointer focus:outline-none text-green-800 font-semibold bg-green-400/70 backdrop-blur-lg rounded-xl p-1 hover:scale-105 transition-transform duration-200 ${className}`}
    >
      {children}
    </button>
  )
);

export default NewChatModal;
