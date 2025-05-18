import type { UserType } from "@/contexts/AuthProvider";
import { useAuth } from "@hooks/useAuth";

export type ChatType = {
  _id: string;
  chatName: string;
  createdAt: string;
  isGroupChat: boolean;
  updatedAt: string;
  users: UserType[];
  latestMessage?: { sender: UserType };
  groupAdmin: string;
};

function ChatList({ chatList }: { chatList: ChatType[] }) {
  const { user } = useAuth();

  console.log(chatList);
  return chatList.map((chat) => (
    <div
      key={chat._id}
      className="bg-white/50 rounded-3xl flex justify-between items-center p-4"
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
