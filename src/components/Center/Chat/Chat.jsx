import { useRef } from "react";
import Message from "./Message";

function Chat() {
  const lastDiv = useRef(null);

  return (
    <div className="flex flex-col h-full overflow-y-scroll justify-start px-2 py-1 border-b-2 border-b-white/25">
      <Message />
      <Message isSameUser />
      <Message />
      <Message isSameUser />
      <Message />
      <Message />
      <Message />
      <Message />
      <div ref={lastDiv} />
    </div>
  );
}

export default Chat;
