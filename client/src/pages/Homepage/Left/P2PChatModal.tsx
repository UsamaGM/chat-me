import { Loader, TextInput } from "@/components";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState, type ChangeEvent } from "react";
import api from "@/config/api";
import type { UserType } from "@/contexts/AuthContext";
import { toast } from "react-toast";
import errorHandler from "@/config/errorHandler";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import type { ChatType } from "@/contexts/ChatContext";

function P2PChatModal({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setSelectedChat, updateChats } = useChat();
  const navigate = useNavigate();

  let timeout: NodeJS.Timeout | undefined = undefined;
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/${e.target.value || "*"}`);

        if (response.data) setUsers(response.data.users);
      } catch (error) {
        console.log(error);
        toast.error(errorHandler(error));
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  async function createNewChat(userId: string) {
    setLoading(true);

    try {
      const response = await api.post("/chat", { userId });
      const chat: ChatType = response.data.chat;

      if (chat) {
        await updateChats();
        setSelectedChat(chat);
        navigate(`/home/chat/${chat._id}`);
      } else {
        toast.error("Error creating chat...");
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setLoading(false);
      onClose();
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
        <h3 className="font-semibold text-lg">Search User</h3>
        <TextInput
          placeholder="Search by name or email..."
          iconNode={<UserIcon />}
          {...{ onChange: handleChange }}
        />
        <div className="flex flex-col w-full gap-3 overflow-y-auto p-1">
          {loading ? (
            <Loader size="small" />
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                className="w-full cursor-pointer"
                onClick={() => createNewChat(user._id)}
              >
                <div className="flex items-center justify-start gap-3 w-full h-10 bg-white/40 rounded-xl shadow-md drop-shadow-md px-3 overflow-hidden">
                  <img
                    src={user.pic}
                    alt="pic"
                    className="size-8 rounded-full object-cover"
                  />
                  <p>
                    {user.name} {`(${user.email})`}{" "}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default P2PChatModal;
