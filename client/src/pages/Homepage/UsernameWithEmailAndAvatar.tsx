import type { UserType } from "@/contexts/AuthProvider";
import type { ReactNode } from "react";

function UsernameWithEmailAndAvatar({
  user,
  rightIcons,
}: {
  user: UserType | null;
  rightIcons: ReactNode;
}) {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex justify-start items-center gap-4">
        <img
          src={user?.pic}
          alt="User"
          className="w-12 h-12 rounded-full bg-cover bg-center"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            {user?.name || "John Doe"}
          </h1>
          <p className="text-sm text-gray-600">{user?.email || "Email"}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">{rightIcons}</div>
    </div>
  );
}

export default UsernameWithEmailAndAvatar;
