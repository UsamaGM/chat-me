import background from "@/assets/background.png";
import { UserMinusIcon } from "@heroicons/react/24/solid";
import ChatList from "./Left/ChatList";
import CreateGroupChatModal from "./Left/CreateGroupChatModal";
import NewChatModal from "./Left/NewChatModal";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
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

      const handleNewMessage = (newMessage: MessageType) => {
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

        if (pathname !== `/home/chat/${newMessage.chat._id}`) {
          toast.info(
            `New message in ${
              newMessage.chat.isGroupChat
                ? newMessage.chat.chatName
                : newMessage.sender.name
            }`
          );
        }
      };

      const handleUserStatusChange = ({
        userId,
        status,
      }: {
        userId: string;
        status: "online" | "offline";
      }) => {
        setChats((prevChats) =>
          prevChats.map((chat) => ({
            ...chat,
            users: chat.users.map((u) =>
              u._id === userId ? { ...u, isOnline: status === "online" } : u
            ),
          }))
        );
      };

      const handleUserAdded = (updatedChat: ChatType) => {
        console.log("User added", updatedChat);

        setChats((prevChats) => {
          if (!prevChats.some((c) => c._id === updatedChat._id)) {
            toast.info(
              "You have been added to a new group chat." + updatedChat.chatName
            );
            return [updatedChat, ...prevChats];
          }
          toast.info(
            `User ${
              updatedChat.users.at(-1)?.name
            } has been added to the group chat.`
          );
          return prevChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          );
        });
      };

      const handleUserRemoved = (updatedChat: ChatType) => {
        console.log("User removed", updatedChat);
        if (!updatedChat.users.some((u) => u._id === user?._id)) {
          toast.error("You have been removed from the group.");
          setChats((prevChats) =>
            prevChats.filter((chat) => chat._id !== updatedChat._id)
          );
          if (location.pathname === `/home/chat/${updatedChat._id}`) {
            navigate("/home");
            toast.info("You have been removed from the group.");
          }
          return;
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === updatedChat._id
              ? {
                  ...chat,
                  users: chat.users.filter(
                    (u) => u._id !== updatedChat.users[0]._id
                  ),
                }
              : chat
          )
        );
      };

      sock.on("new message", handleNewMessage);
      sock.on("user-status-change", handleUserStatusChange);

      sock.on("user added", handleUserAdded);
      sock.on("user removed", handleUserRemoved);

      sock.on("chat-removed", ({ chatId }: { chatId: string }) => {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat._id !== chatId)
        );

        if (pathname === `/home/chat/${chatId}`) {
          navigate("/home");
          toast.info("You have been removed from the group.");
        }
      });

      return () => {
        sock.disconnect();
      };
    }
  }, [isAuthenticated, user, pathname, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex bg-white/15 backdrop-blur-2xl shadow rounded-3xl overflow-hidden max-w-7xl w-full h-full">
        {/* Chat List Side */}
        <div className="relative flex flex-col flex-1/3 gap-5 p-6">
          <UsernameWithEmailAndAvatar
            title={user?.name}
            subtitle={user?.email}
            pic={user?.pic}
            rightIcons={
              <button className="bg-white/35 p-2 rounded-full" title="Logout">
                <UserMinusIcon className="w-6 h-6 text-gray-600 hover:animate-ring-bell" />
              </button>
            }
          />
          <div className="flex flex-col h-full overflow-auto space-y-2 pr-2">
            <ChatList chatList={chats} />
            <NewChatModal
              toggleChatModals={(value) => setShowChatModal(value)}
            />
          </div>
        </div>

        <Outlet
          context={{
            selectedChat: chats.find(
              (chat) => chat._id === location.pathname.split("/").at(-1)
            ),
            socket: socket.current,
          }}
        />

        {showChatModal === "p2p" && (
          <P2PChatModal
            onClose={() => setShowChatModal("none")}
            addChat={(chat: ChatType) => setChats((prev) => [chat, ...prev])}
          />
        )}
        {showChatModal === "group" && (
          <CreateGroupChatModal
            onClose={() => setShowChatModal("none")}
            addChat={(chat: ChatType) => setChats((prev) => [chat, ...prev])}
          />
        )}
      </div>
    </div>
  );
}

export default Homepage;
