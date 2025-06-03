import { TextInput } from "@/components";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState, type ChangeEvent } from "react";
import api from "@/config/api";
import type { UserType } from "@/contexts/AuthProvider";

function NewChatModal({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<UserType[]>([]);

  let timeout: NodeJS.Timeout | undefined = undefined;
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (timeout) clearTimeout(timeout);

    if (e.target.value)
      timeout = setTimeout(async () => {
        const response = await api.get(`/user/${e.target.value}`);

        if (response.data) setUsers(response.data.users);
      }, 500);
  }

  return (
    <div
      onClick={onClose}
      className="fixed bg-white/15 backdrop-blur-xs w-screen h-screen flex justify-center pt-10 z-50 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-3 max-h-3/5 bg-white/15 backdrop-blur-lg shadow-md drop-shadow-md drop-shadow-black/25 rounded-xl p-6 animate-slide-in"
      >
        <h3 className="font-semibold text-lg">Search User</h3>
        <TextInput
          placeholder="Search by name or email..."
          iconNode={<UserIcon />}
          {...{ onChange: handleChange }}
        />
        {users.map((user) => (
          <div>{user.name}</div>
        ))}
      </div>
    </div>
  );
}

export default NewChatModal;
