import { useEffect, useMemo, useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

import ClickableIcon from "../ClickableIcon";
import ChatItem from "./ChatItem";

function AddChat({ onAddChat }) {
  const users = useMemo(
    () => [
      {
        id: 4,
        name: "Kashif",
        profileUrl: "/profile.jpg",
        lastMessage: {
          time: "12/03/2024 08:17",
          message: {
            text: "Whats up budy?",
          },
        },
        lastOnline: "12/03/2024 15:25",
      },
      {
        id: 5,
        name: "Kirtan",
        profileUrl: "/profile.jpg",
        lastMessage: {
          time: "12/03/2024 12:50",
          message: {
            text: "Kehra haal ahin sain?",
          },
        },
        lastOnline: "12/04/2024 15:00",
      },
      {
        id: 6,
        name: "Ghulam Mustafa",
        profileUrl: "/profile.jpg",
        lastMessage: {
          time: "12/03/2024 11:43",
          message: {
            imageUrl: "/image3.jpg",
            text: "Hattit!!!",
          },
        },
        lastOnline: "12/03/2024 15:07",
      },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(
    () =>
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [search, users]
  );

  return (
    <div className="flex flex-col w-2/6 h-1/2 z-20 p-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md border-2 border-white/25 rounded-md text-white">
      <p className="text-center font-bold">Add Chat</p>
      <div className="flex items-center gap-2">
        <input
          className="w-full bg-white/50 backdrop-blur-md px-3 py-1 outline-none rounded-md"
          type="text"
          name="addChat"
          id="addChat"
          value={search}
          placeholder="Enter name..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <ClickableIcon className="size-6 hover:text-white/75" icon={faAdd} />
      </div>
      <div className="flex flex-col gap-2 mt-2 overflow-y-scroll overflow-x-hidden">
        {filteredUsers.map((user) => (
          <ChatItem key={user.id} user={user} onClick={() => onAddChat(user)} />
        ))}
      </div>
    </div>
  );
}

AddChat.propTypes = {
  onAddChat: PropTypes.func,
};

export default AddChat;
