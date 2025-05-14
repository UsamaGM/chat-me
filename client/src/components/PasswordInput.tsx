import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

function PasswordInput({ error, ...rest }: { error?: string }) {
  const [showPassowrd, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-2 bg-[#EEF3F5] border border-gray-200 rounded-lg px-3 py-2 min-w-sm">
        {showPassowrd ? (
          <LockOpenIcon className="h-6 w-6 text-[#7D8A97]" />
        ) : (
          <LockClosedIcon className="h-6 w-6 text-[#7D8A97]" />
        )}
        <input
          type={showPassowrd ? "text" : "password"}
          className="h-full w-full focus:outline-none"
          placeholder="Password"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassowrd)}
          className="text-[#7D8A97] hover:text-[#42bedd]"
        >
          {showPassowrd ? (
            <EyeSlashIcon className="h-6 w-6 text-[#7D8A97]" />
          ) : (
            <EyeIcon className="h-6 w-6 text-[#7D8A97]" />
          )}
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-sm text-start -mt-1">{error}</span>
      )}
    </div>
  );
}

export default PasswordInput;
