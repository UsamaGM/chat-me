import {
  Bars3Icon,
  BellIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import background from "@/assets/background.png";
import Chat from "./Chat";
import ChatList from "./ChatList";
import { Loader } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";

function Homepage() {
  const { user, logout } = useAuth();
  const { loading, chats, selectedChat } = useChat();

  if (loading) return <Loader size="large" />;

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

        {/* Chat Side */}
        <div className="flex flex-col flex-2/3 bg-white/30 rounded-3xl">
          {selectedChat ? (
            <>
              <div className="p-6">
                <UsernameWithEmailAndAvatar
                  user={selectedChat.users.find((u) => u._id != user?._id)!}
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

              {/* Currently Selected Chat */}
              <Chat />
            </>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p>Hello There! Select a Chat and get going!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
