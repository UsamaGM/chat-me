import background from "@/assets/background.png";
import { BellIcon } from "@heroicons/react/24/solid";
import ChatList from "./Left/ChatList";
import CreateGroupChatModal from "./Left/CreateGroupChatModal";
import NewChatModal from "./Left/NewChatModal";
import { Outlet } from "react-router-dom";
import P2PChatModal from "./Left/P2PChatModal";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";
import { useState } from "react";

function Homepage() {
  const [showChatModal, setShowChatModal] = useState<"p2p" | "group" | "none">(
    "none"
  );

  const { user } = useAuth();
  const { chats } = useChat();

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex bg-white/15 backdrop-blur-2xl shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full">
        {/* Chat List Side */}
        <div className="flex flex-col flex-1/3 gap-5 p-6">
          {/* User Name with Email */}
          <UsernameWithEmailAndAvatar
            user={user}
            rightIcons={
              <BellIcon className="w-6 h-6 text-gray-600 hover:animate-ring-bell" />
            }
          />

          {/* Chats List */}
          <div className="relative flex flex-col h-full overflow-auto space-y-2 pr-2">
            <ChatList chatList={chats} />

            {/* New Chat Modal */}
            <NewChatModal
              toggleChatModals={(value) => setShowChatModal(value)}
            />
          </div>
        </div>

        {/* Selected Chat */}
        <Outlet />

        {/* P2P Chat Modal */}
        {showChatModal === "p2p" && (
          <P2PChatModal onClose={() => setShowChatModal("none")} />
        )}

        {/* Group Chat Modal */}
        {showChatModal === "group" && (
          <CreateGroupChatModal onClose={() => setShowChatModal("none")} />
        )}
      </div>
    </div>
  );
}

export default Homepage;
