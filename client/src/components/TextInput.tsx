import type { ReactNode } from "react";

function TextInput({
  iconNode,
  error,
  placeholder,
  ...rest
}: {
  iconNode: ReactNode;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-2 bg-white/20 backdrop-blur-sm border border-gray-200 rounded-xl shadow px-3 py-2 min-w-sm ">
        <div className="w-6 h-6 p-0.5 text-[#7D8A97]">{iconNode}</div>
        <input
          type="text"
          placeholder={placeholder}
          className="h-full w-full focus:outline-none"
          {...rest}
        />
      </div>
      {error && <span className="text-red-500 text-sm -mt-1">{error}</span>}
    </div>
  );
}

export default TextInput;
