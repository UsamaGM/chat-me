import {
  faArrowUp,
  faCamera,
  faLink,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";

import ClickableIcon from "../ClickableIcon";

function MessageBox() {
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
        placeholder="Enter your message..."
      />
      <div className="flex items-center gap-3">
        <ClickableIcon className={"size-5"} icon={faSmile} />
        <ClickableIcon
          className={
            "bg-white/25 backdrop-blur-md rounded-md p-1 hover:bg-black/25 size-6"
          }
          icon={faArrowUp}
        />
      </div>
    </div>
  );
}

export default MessageBox;
