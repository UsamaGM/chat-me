import { useState, type ChangeEvent } from "react";
import type { ChatType } from "@/types/chat";
import type { UserType } from "@/contexts/AuthContext";
import api from "@/config/api";
import { toast } from "react-toast";
import errorHandler from "@/config/errorHandler";
import { Loader, TextInput } from "@/components";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";

interface GroupSettingsModalProps {
  chat: ChatType;
  onClose: () => void;
  updateChats: () => Promise<void>;
}

function GroupSettingsModal({
  chat,
  onClose,
  updateChats,
}: GroupSettingsModalProps) {
  const { user: currentUser } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<UserType[]>([]);

  let searchTimeout: NodeJS.Timeout | undefined;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const query = e.target.value;
    if (!query) {
      setSearchResult([]);
      return;
    }
    searchTimeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await api.get(`/user/${query}`);
        // Filter out users who are already in the group
        const newUsers = data.users.filter(
          (user: UserType) =>
            !chat.users.some((chatUser) => chatUser._id === user._id)
        );
        setSearchResult(newUsers);
      } catch (error) {
        toast.error(errorHandler(error));
      } finally {
        setSearchLoading(false);
      }
    }, 500);
  };

  const handleAddUser = async (userToAdd: UserType) => {
    setActionLoading(true);
    try {
      await api.put("/chat/group-add", {
        chatId: chat._id,
        userId: userToAdd._id,
      });
      toast.success(`${userToAdd.name} was added to the group.`);
      await updateChats();
      onClose(); // Close modal on success
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveUser = async (userToRemove: UserType) => {
    setActionLoading(true);
    try {
      await api.put("/chat/group-remove", {
        chatId: chat._id,
        userId: userToRemove._id,
      });
      toast.warn(`${userToRemove.name} was removed from the group.`);
      await updateChats();
      onClose(); // Close modal on success
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {chat.chatName}
        </h2>

        {/* Member List */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">
            Members ({chat.users.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {chat.users.map((member) => (
              <div
                key={member._id}
                className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 flex items-center gap-2 text-sm"
              >
                <img
                  src={member.pic}
                  alt={member.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>
                  {member.name}{" "}
                  {member._id === chat.groupAdmin._id && (
                    <span className="text-xs text-blue-600">(Admin)</span>
                  )}
                </span>
                {currentUser?._id === chat.groupAdmin._id &&
                  member._id !== chat.groupAdmin._id && (
                    <button
                      onClick={() => handleRemoveUser(member)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Add Member</h3>
          <TextInput
            placeholder="Search users by name or email..."
            iconNode={<UserPlusIcon />}
            {...{ onChange: handleSearch }}
          />
          {searchLoading && (
            <div className="mt-2">
              <Loader size="small" />
            </div>
          )}
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {searchResult.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.pic}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddUser(user)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 self-center"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default GroupSettingsModal;
