import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function PasswordInput({ error, ...rest }: { error?: string }) {
  const [showPassowrd, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-2 bg-white/20 backdrop-blur-sm shadow border border-gray-200 rounded-xl px-3 py-2 min-w-sm">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassowrd)}
          className="cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
        >
          {showPassowrd ? (
            <LockOpenIcon className="h-6 w-6 text-[#7D8A97]" />
          ) : (
            <LockClosedIcon className="h-6 w-6 text-[#7D8A97]" />
          )}
        </button>
        <input
          type={showPassowrd ? "text" : "password"}
          className="h-full w-full focus:outline-none"
          placeholder="Password"
          {...rest}
        />
      </div>
      {error && (
        <span className="text-red-500 text-sm text-start -mt-1">{error}</span>
      )}
    </div>
  );
}

export default PasswordInput;
