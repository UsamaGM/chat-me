import { BellIcon } from "@heroicons/react/24/solid";
import background from "@/assets/background.png";
import ChatList from "./ChatList";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";
import { Outlet } from "react-router-dom";

function Homepage() {
  const { user } = useAuth();
  const { chats } = useChat();

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex bg-white/15 backdrop-blur-2xl shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full m-6">
        {/* Chat List Side */}
        <div className="flex flex-col flex-1/3 p-6">
          {/* User Name with Email */}
          <UsernameWithEmailAndAvatar
            user={user}
            rightIcons={
              <BellIcon className="w-6 h-6 text-gray-600 hover:animate-ring-bell" />
            }
          />

          {/* Chats List */}
          <div className="flex flex-col mt-10 overflow-auto space-y-2 pr-2">
            <ChatList chatList={chats} />
          </div>
        </div>

        {/* Selected Chat */}
        <Outlet />
      </div>
    </div>
  );
}

export default Homepage;
