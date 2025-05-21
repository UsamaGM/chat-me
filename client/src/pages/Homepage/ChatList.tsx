import type { ChatType } from "@/contexts/ChatContext";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@hooks/useAuth";

function ChatList({ chatList }: { chatList: ChatType[] }) {
  const { user } = useAuth();
  const { setSelectedChat } = useChat();

  return chatList.map((chat) => (
    <div
      key={chat._id}
      className="bg-white/50 rounded-3xl cursor-pointer flex justify-between items-center px-6 py-2"
      onClick={() => setSelectedChat(chat)}
    >
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-800">
          {chat.isGroupChat
            ? chat.chatName
            : chat.users.find((u) => u._id != user?._id)?.name}
        </h1>

        <p className="text-sm text-gray-600">
          {chat.latestMessage?.sender.name || (
            <span className="text-blue-700 font-semibold">New Chat</span>
          )}
        </p>
      </div>
      <p className="text-sm text-gray-500">{chat.updatedAt}</p>
    </div>
  ));
}

export default ChatList;
