import formatDateTime from "@/config/formatter";
import type { ChatType } from "@/contexts/ChatContext";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";

function ChatList({ chatList }: { chatList: ChatType[] }) {
  const { user } = useAuth();
  const { setSelectedChat } = useChat();
  const navigate = useNavigate();

  return chatList.map((chat) => {
    const { day, time, isToday } = formatDateTime(chat.updatedAt);

    return (
      <div
        key={chat._id}
        className="bg-white/50 rounded-3xl cursor-pointer flex justify-between items-center max-w-lg px-6 py-2"
        onClick={() => {
          navigate(`/home/chat/${chat._id}`);
          setSelectedChat(chat);
        }}
      >
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-800">
            {chat.isGroupChat
              ? chat.chatName
              : chat.users.find((u) => u._id != user?._id)?.name}
          </h1>

          <p className="text-sm text-gray-600">
            {chat.latestMessage?.content || "New Chat"}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {isToday ? time : `${day}, ${time}`}
        </p>
      </div>
    );
  });
}

export default ChatList;
