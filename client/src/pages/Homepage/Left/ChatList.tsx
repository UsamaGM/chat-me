import formatDateTime from "@/config/formatter";
import type { ChatType } from "@/types/chat";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";

function ChatList({ chatList }: { chatList: ChatType[] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return chatList.map((chat) => {
    const { time } = formatDateTime(chat.updatedAt);
    const isSelectedChat = location.pathname.split("/").at(-1) === chat._id;

    return (
      <button
        key={chat._id}
        className={`flex flex-col ${
          isSelectedChat ? "bg-white/30" : "bg-white/15"
        } rounded-3xl cursor-pointer items-start justify-between max-w-lg px-6 py-4 shadow-sm`}
        onClick={() => {
          if (!isSelectedChat) {
            navigate(`/home/chat/${chat._id}`);
          }
        }}
      >
        <h1 className="text-lg font-semibold text-gray-800">
          {chat.isGroupChat
            ? chat.chatName
            : chat.users.find((u) => u._id != user?._id)?.name}
        </h1>
        <div className="flex justify-between w-full">
          <p className="text-sm text-gray-600 line-clamp-1">
            {chat.latestMessage?.content || "New Chat"}
          </p>
          <span className="text-sm text-gray-500 self-end">{time}</span>
        </div>
      </button>
    );
  });
}

export default ChatList;
