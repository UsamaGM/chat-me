import { useState, type ChangeEvent } from "react";
import { Loader, TextInput } from "@/components";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";
import api from "@/config/api";
import { toast } from "react-toast";
import errorHandler from "@/config/errorHandler";
import { useChat } from "@/hooks/useChat";
import { useNavigate } from "react-router-dom";
import type { ChatType } from "@/contexts/ChatContext";
import type { UserType } from "@/contexts/AuthContext";

function CreateGroupChatModal({ onClose }: { onClose: () => void }) {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateChats } = useChat();
  const navigate = useNavigate();

  let timeout: NodeJS.Timeout | undefined;
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/${e.target.value || "*"}`);
        if (response.data) setUsers(response.data.users);
      } catch (error) {
        toast.error(errorHandler(error));
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  function toggleUserSelection(user: UserType) {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  async function createGroupChat() {
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Group name and members are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/chat/group", {
        chatName: groupName,
        users: selectedUsers.map((user) => user._id),
      });
      const groupChat: ChatType = response.data.groupChat;

      if (groupChat) {
        await updateChats();
        navigate(`/home/chat/${groupChat._id}`);
        onClose();
      } else {
        toast.error("Error creating group chat");
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed bg-white/15 backdrop-blur-xs w-screen h-screen flex justify-center pt-10 z-50 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-5 max-h-3/5 bg-white/35 backdrop-blur-lg shadow-md drop-shadow-md drop-shadow-black/25 rounded-xl p-6 animate-slide-in"
      >
        <h3 className="font-semibold text-lg">Create Group Chat</h3>
        <TextInput
          iconNode={<UserGroupIcon />}
          placeholder="Group Name"
          {...{
            value: groupName,
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              setGroupName(e.target.value),
          }}
        />
        <TextInput
          iconNode={<UserIcon />}
          placeholder="Search users..."
          {...{ onChange: handleSearch }}
        />
        <div className="flex flex-col w-full gap-3 overflow-y-auto p-1">
          {loading ? (
            <Loader size="small" />
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                className={`w-full cursor-pointer flex items-center justify-start gap-3 p-2 rounded-xl shadow-md ${
                  selectedUsers.find((u) => u._id === user._id)
                    ? "bg-green-300"
                    : "bg-white/40"
                }`}
                onClick={() => toggleUserSelection(user)}
              >
                <img
                  src={user.pic}
                  alt="pic"
                  className="size-8 rounded-full object-cover"
                />
                <p>
                  {user.name} ({user.email})
                </p>
              </button>
            ))
          )}
        </div>
        <button
          onClick={createGroupChat}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroupChatModal;
