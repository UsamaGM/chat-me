import { useState } from "react";
import {
  faArrowUp,
  faCamera,
  faLink,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

import ClickableIcon from "../ClickableIcon";

function MessageBox({ currentUserId, selectedUserId, onSend }) {
  const [text, setText] = useState("");

  return (
    <div className="flex w-full p-2 gap-3">
      <div className="flex items-center gap-3">
        <ClickableIcon icon={faCamera} className={"size-5"} />
        <ClickableIcon icon={faLink} className={"size-5"} />
      </div>
      <input
        className="w-full bg-white/25 backdrop-blur-md px-3 py-1 outline-none rounded-md"
        type="text"
        name="messageBox"
        id="messageBox"
        value={text}
        placeholder="Enter your message..."
        onChange={(e) => {
          setText(e.target.value);
          console.log(new Date().toTimeString());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const currentdate = new Date();
            onSend({
              from: currentUserId,
              to: selectedUserId,
              time:
                currentdate.getMonth() +
                1 +
                "/" +
                currentdate.getDate() +
                "/" +
                currentdate.getFullYear() +
                " " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes(),
              text,
            });
            setText("");
          }
        }}
      />
      <div className="flex items-center gap-3">
        <ClickableIcon className={"size-5"} icon={faSmile} />
        <ClickableIcon
          className={
            "bg-white/25 backdrop-blur-md rounded-md p-1 hover:bg-black/25 size-6"
          }
          icon={faArrowUp}
          onClick={() => {
            onSend(text);
            setText("");
          }}
        />
      </div>
    </div>
  );
}

MessageBox.propTypes = {
  currentUserId: PropTypes.number,
  selectedUserId: PropTypes.number,
  onSend: PropTypes.func,
};

export default MessageBox;
