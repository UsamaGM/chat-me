import { BellIcon, PlusIcon } from "@heroicons/react/24/solid";
import background from "@/assets/background.png";
import ChatList from "./ChatList";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import NewChatModal from "./NewChatModal";

function Homepage() {
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const { user } = useAuth();
  const { chats } = useChat();

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex bg-white/15 backdrop-blur-2xl shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full m-6">
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

            {/* New Chat Button */}
            <div className="absolute bottom-5 right-1 z-10">
              <button
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center gap-3 pl-2 cursor-pointer focus:outline-none font-semibold text-green-800 bg-green-400/50 backdrop-blur-lg rounded-xl p-1 hover:scale-105 transition-transform duration-200"
              >
                New Chat
                <PlusIcon className="size-10 bg-green-300 rounded-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Chat */}
        <Outlet />

        {/* New Chat Modal */}
        {showNewChatModal && (
          <NewChatModal onClose={() => setShowNewChatModal(false)} />
        )}
      </div>
    </div>
  );
}

export default Homepage;
