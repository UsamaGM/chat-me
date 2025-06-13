import background from "@/assets/background.png";
import { BellIcon } from "@heroicons/react/24/solid";
import ChatList from "./Left/ChatList";
import CreateGroupChatModal from "./Left/CreateGroupChatModal";
import NewChatModal from "./Left/NewChatModal";
import { Outlet, useLoaderData } from "react-router-dom";
import P2PChatModal from "./Left/P2PChatModal";
import { useAuth } from "@/hooks/useAuth";
import UsernameWithEmailAndAvatar from "./UsernameWithEmailAndAvatar";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";
import createSocket from "@/config/createSocket";
import api from "@/config/api";
import { toast } from "react-toast";
import errorHandler from "@/config/errorHandler";
import type { ChatType, MessageType } from "@/types/chat";

function Homepage() {
  const [showChatModal, setShowChatModal] = useState<"p2p" | "group" | "none">(
    "none"
  );
  const { user, isAuthenticated } = useAuth();
  const loaderData = useLoaderData() as { data: { chats: ChatType[] } };
  const [chats, setChats] = useState<ChatType[]>(loaderData?.data?.chats || []);
  const socket = useRef<Socket | null>(null);

  const updateChats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get("/chat");
      if (response.status === 200) {
        setChats(response.data.chats);
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      updateChats();
    }
  }, [isAuthenticated, updateChats]);

  useEffect(() => {
    if (isAuthenticated) {
      socket.current = createSocket();
      const sock = socket.current;

      sock.emit("user-online", user?._id);
      sock.on("chat-updated", (newMessage: MessageType) => {
        setChats((prevChats) =>
          prevChats
            .map((chat) =>
              chat._id === newMessage.chat._id
                ? {
                    ...chat,
                    latestMessage: newMessage,
                    updatedAt: newMessage.updatedAt,
                  }
                : chat
            )
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
        );
      });

      sock.on(
        "user-status-change",
        ({
          userId,
          status,
        }: {
          userId: string;
          status: "online" | "offline";
        }) => {
          //TODO:Here you would implement logic to update the user's status in your state.
          // This might involve adding an 'isOnline' property to your UserType.
          console.log(`User ${userId} is now ${status}`);
          // Example:
          // setChats(prevChats =>
          //   prevChats.map(chat => ({
          //     ...chat,
          //     users: chat.users.map(u =>
          //       u._id === userId ? { ...u, isOnline: status === 'online' } : u
          //     ),
          //   }))
          // );
        }
      );

      return () => {
        sock.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex bg-white/15 backdrop-blur-2xl shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full">
        {/* Chat List Side */}
        <div className="relative flex flex-col flex-1/3 gap-5 p-6">
          <UsernameWithEmailAndAvatar
            user={user}
            rightIcons={
              <BellIcon className="w-6 h-6 text-gray-600 hover:animate-ring-bell" />
            }
          />
          <div className="flex flex-col h-full overflow-auto space-y-2 pr-2">
            <ChatList chatList={chats} />
            <NewChatModal
              toggleChatModals={(value) => setShowChatModal(value)}
            />
          </div>
        </div>

        <Outlet context={{ chats, socket: socket.current, updateChats }} />

        {showChatModal === "p2p" && (
          <P2PChatModal
            onClose={() => setShowChatModal("none")}
            updateChats={updateChats}
          />
        )}
        {showChatModal === "group" && (
          <CreateGroupChatModal
            onClose={() => setShowChatModal("none")}
            updateChats={updateChats}
          />
        )}
      </div>
    </div>
  );
}

export default Homepage;
