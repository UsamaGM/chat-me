import { useEffect, useRef } from "react";
import Message from "./Message";

function Chat() {
  const lastDiv = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-scroll justify-start px-2 py-1 border-b-2 border-b-white/25">
      <Message message="Hello Usama. How are you?" />
      <Message message="Hey, I am fine. What about you?" isSameUser />
      <Message message="I am also fine. I was just curious about meeting you tomorrow?" />
      <Message message="Me too! What are your plans for the day?" isSameUser />
      <Message message="Maybe we should focus on the project we are working on together." />
      <Message message="Sounds good. See you tomorrow!" isSameUser />
      <Message message="Thanks" />
      <Message message="You are welcome" isSameUser />
      <div ref={lastDiv} />
    </div>
  );

  function scrollToBottom() {
    if (lastDiv.current) {
      lastDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }
}

export default Chat;
