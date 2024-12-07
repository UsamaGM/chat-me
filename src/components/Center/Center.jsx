import { useState } from "react";
import { faBars, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

import Chat from "./Chat/Chat";
import MessageBox from "./MessageBox";
import ClickableIcon from "../ClickableIcon";

function Center({ user, currentChat }) {
  const initialMessages = [
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 1,
      to: 2,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 1,
      to: 2,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 1,
      to: 2,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 1,
      to: 2,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 1,
      to: 2,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
    {
      from: 2,
      to: 1,
      time: "12/04/2024 12:00",
      text: "Hello Usama. How are you?",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  return (
    <div
      className="flex flex-col relative py-1 border-r-2 border-r-white/25"
      style={{ flex: 2 }}
    >
      <div className="flex flex-wrap justify-between items-center gap-3 px-2 py-1 border-b-2 border-b-white/25 w-full h-fit">
        <img
          className="w-10 h-10 rounded-md object-center bg-clip-border"
          src={user.image}
          alt="profile"
        />
        <span className="text-lg font-medium flex-1 overflow-hidden select-none max-h-6">
          {user.name}
        </span>
        <ClickableIcon
          icon={faPhone}
          className="hover:text-black/50 hover:cursor-pointer"
        />
        <ClickableIcon
          icon={faVideo}
          className="hover:text-black/50 hover:cursor-pointer"
        />
        <ClickableIcon
          icon={faBars}
          className="hover:text-black/50 hover:cursor-pointer"
        />
      </div>
      <Chat currentUserId={user.id} messages={messages} />
      <MessageBox
        currentUserId={user.id}
        selectedUserId={currentChat}
        onSend={(newMessage) => setMessages((prev) => [...prev, newMessage])}
      />
    </div>
  );
}

Center.propTypes = {
  user: PropTypes.object,
  currentChat: PropTypes.number,
};

export default Center;
