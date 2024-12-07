import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faMinus,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

import ChatItem from "./ChatItem";
import ClickableIcon from "../ClickableIcon";
import AddChat from "./AddChat";

function Left({ user, setCurrentChat }) {
  const users = [
    {
      id: 1,
      name: "Shahzeb",
      profileUrl: "/profile.jpg",
      lastMessage: {
        time: "12/03/2024 08:15",
        message: {
          imageUrl: "/image1.jpg",
          text: "Remember this moment? Those were the golden days.",
        },
      },
      lastOnline: "12/03/2024 15:09",
    },
    {
      id: 2,
      name: "Samian",
      profileUrl: "/profile.jpg",
      lastMessage: {
        time: "12/03/2024 12:45",
        message: {
          text: "Who are you enjoying with?",
        },
      },
      lastOnline: "12/03/2024 15:07",
    },
    {
      id: 3,
      name: "Soban",
      profileUrl: "/profile.jpg",
      lastMessage: {
        time: "12/03/2024 12:56",
        message: {
          imageUrl: "/image2.jpg",
          text: "Nice pic dear!",
        },
      },
      lastOnline: "12/03/2024 15:07",
    },
  ];

  const [showMenu, setShowMenu] = useState(false);
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [chatUsers, setChatUsers] = useState(users);

  const { name, image } = user;

  return (
    <div className="flex flex-col flex-1 pt-1 border-r-2 border-r-white/25 items-center justify-center select-none">
      <div className="flex flex-wrap justify-between items-center gap-3 px-2 py-1 border-b-2 border-b-white/25 w-full h-fit">
        <img
          className="w-10 h-10 rounded-md object-center bg-clip-border"
          src={image}
          alt="profile"
        />
        <span className="text-lg font-medium flex-1 overflow-hidden select-none max-h-6">
          {name}
        </span>
        <ClickableIcon
          icon={faGear}
          onClick={() => {
            showNewChatMenu && setShowNewChatMenu(false);
            setShowMenu((prev) => !prev);
          }}
        />
      </div>
      <div className="flex justify-between items-center px-2 py-6 gap-3 border-b-2 border-b-white/25 w-full h-10">
        <FontAwesomeIcon icon={faSearch} />
        <input
          className="w-full bg-white/25 px-2 py-1 rounded-lg backdrop-blur-md outline-none"
          type="text"
          name="search"
          id="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
        />
        <ClickableIcon
          icon={showNewChatMenu ? faMinus : faPlus}
          onClick={() => {
            showMenu && setShowMenu(false);
            setShowNewChatMenu((prev) => !prev);
          }}
        />
      </div>
      <div className="flex flex-col w-full h-full overflow-y-scroll gap-2 p-1">
        {chatUsers.map((user) => (
          <ChatItem
            key={user.id}
            user={user}
            onClick={() => setCurrentChat(user.id)}
          />
        ))}
      </div>

      {showMenu && (
        <div
          className={
            "flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/25 border-white/25 border-2 w-2/6 h-fit p-3 backdrop-blur-md rounded-lg"
          }
        >
          <div>Option 1</div>
          <div>Option 2</div>
        </div>
      )}
      {showNewChatMenu && (
        <AddChat
          onAddChat={(newUser) => {
            setShowNewChatMenu(false);
            if (!chatUsers.some((user) => user.id === newUser.id))
              setChatUsers((prev) => [newUser, ...prev]);
          }}
        />
      )}
    </div>
  );
}

Left.propTypes = {
  user: PropTypes.object,
  setCurrentChat: PropTypes.func,
};

export default Left;
