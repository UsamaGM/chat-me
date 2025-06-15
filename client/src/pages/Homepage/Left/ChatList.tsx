import formatDateTime from "@/config/formatter";
import type { ChatType } from "@/types/chat";
import { useAuth } from "@hooks/useAuth";
import { Link } from "react-router-dom";

function ChatList({ chatList }: { chatList: ChatType[] }) {
  const { user } = useAuth();

  return chatList.map((chat) => {
    const { time } = formatDateTime(chat.updatedAt);

    return (
      <Link
        prefetch="none"
        key={chat._id}
        className="bg-white/30 backdrop-blur-md rounded-3xl cursor-pointer flex justify-between items-center max-w-lg px-6 py-4 shadow-lg hover:scale-105 transition-transform duration-300"
        to={`/home/chat/${chat._id}`}
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
        <span className="text-sm text-gray-500">{time}</span>
      </Link>
    );
  });
}

export default ChatList;
