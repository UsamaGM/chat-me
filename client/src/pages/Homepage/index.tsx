import {
  Bars3Icon,
  BellIcon,
  PhoneIcon,
  ShareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import image from "@/assets/background.png";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components";
import api from "@/config/api";
import { toast } from "react-toast";
import errorHandler from "@/config/errorHandler";
import ChatList from "./ChatList";

const chatMessages = [
  { sender: "John Doe", message: "Hey John!", time: "12:00 PM" },
  { sender: "John Cloe", message: "Hello John!", time: "12:01 PM" },
  { sender: "John Doe", message: "John, I will kill you.", time: "12:01 PM" },
  { sender: "John Cloe", message: "But why?", time: "12:01 PM" },
  {
    sender: "John Doe",
    message: "Because your first name is same as mine",
    time: "12:02 PM",
  },
  {
    sender: "John Cloe",
    message: "That makes no sense at all!",
    time: "12:02 PM",
  },
  {
    sender: "John Doe",
    message:
      "So John, let me be straight forward! I do not like the people who have the same name as me. I usually end up killing such people. you have two choices now: Either change our name or die",
    time: "12:03 PM",
  },
];

function Homepage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(chatMessages);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    try {
      const {
        data: { chats },
      } = await api.get("/chat");

      setChats(chats);
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader size="large" />;

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="flex bg-white/40 backdrop-blur-lg shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full m-6">
        {/* Chat List Side */}
        <div className="flex flex-col flex-1/3 p-6">
          {/* User Name with Email */}
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-4">
              <img
                src={user?.pic}
                alt="User"
                className="w-12 h-12 rounded-full bg-cover bg-center"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-gray-800">
                  {user?.name || "John Doe"}
                </h1>
                <p className="text-sm text-gray-600">
                  {user?.email || "Email"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <BellIcon className="w-6 h-6 text-gray-600 hover:animate-ring-bell" />
            </div>
          </div>

          {/* Chats List */}
          <div className="flex flex-col mt-10 overflow-auto space-y-2 pr-2">
            <ChatList chatList={chats} />
          </div>
        </div>

        {/* Chat Side */}
        <div className="flex flex-col flex-2/3 bg-white/30 rounded-3xl">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center justify-between gap-4">
              <UserCircleIcon className="w-12 h-12 text-blue-500" />
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg">John Doe</h1>
                <p className="text-sm text-gray-600">Last online: 12:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              <ShareIcon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              <button onClick={logout}>
                <Bars3Icon className="w-9 h-9 p-2 rounded-full bg-blue-700/20 backdrop-blur-md text-blue-600 hover:scale-110 transition duration-300 cursor-pointer" />
              </button>
            </div>
          </div>
          <div className="flex flex-col grow p-6 overflow-y-auto space-y-2">
            {chat.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === "John Doe"
                    ? "bg-blue-700/15"
                    : "bg-green-700/15"
                } backdrop-blur-md rounded-3xl px-4 py-2 space-y-1 max-w-2/3 w-fit text-wrap ${
                  message.sender === "John Doe" ? "self-start" : "self-end"
                }`}
              >
                <p
                  className={
                    message.sender === "John Doe"
                      ? "text-blue-700 text-wrap overflow-ellipsis"
                      : "text-green-700 text-wrap overflow-ellipsis"
                  }
                >
                  {message.message}
                </p>
                <p className="text-xs place-self-end">{message.time}</p>
              </div>
            ))}
            <div ref={chatEndRef} className="h-0" />
          </div>
          <div className="flex items-center justify-between p-6 rounded-b-3xl">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-4 bg-white/30 rounded-3xl border border-blue-700/20 focus:outline-none focus:ring focus:ring-blue-700/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const message = (e.target as HTMLInputElement).value;
                  if (message) {
                    setChat([
                      ...chat,
                      { sender: "John Cloe", message, time: "12:05 PM" },
                    ]);
                    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
