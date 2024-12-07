import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import Message from "./Message";
import ClickableIcon from "../../ClickableIcon";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Chat({ currentUserId, messages = [] }) {
  const chatContainer = useRef(null);
  const lastDiv = useRef(null);

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (lastDiv.current && chatContainer.current) {
      const containerRect = chatContainer.current.getBoundingClientRect();
      const lastDivRect = lastDiv.current.getBoundingClientRect();
      setShowScroll(lastDivRect.top > containerRect.bottom);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-scroll justify-start px-2 py-1 border-b-2 border-b-white/25"
      ref={chatContainer}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <Message
          key={message.time}
          message={message}
          isSameUser={message.from === currentUserId}
        />
      ))}
      <div ref={lastDiv} />
      {showScroll && (
        <ClickableIcon
          className="absolute bottom-16 right-2 z-20 size-5 bg-white/25 backdrop-blur-md border-2 border-black/25 rounded-md px-3 py-1 self-end"
          icon={faArrowDown}
          onClick={scrollToBottom}
        />
      )}
    </div>
  );

  function scrollToBottom() {
    if (lastDiv.current) {
      lastDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }
}

Chat.propTypes = {
  currentUserId: PropTypes.number.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Chat;
