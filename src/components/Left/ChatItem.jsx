import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

function ChatItem({ user, onClick }) {
  const {
    name,
    profileUrl,
    lastMessage: {
      message: { imageUrl, text },
    },
    lastOnline,
  } = user;

  return (
    <div
      className="flex justify-between items-center p-2 gap-2 select-none rounded-md transition-transform duration-200 hover:cursor-pointer hover:scale-105 hover:bg-black/20 hover:text-white/75"
      onClick={onClick}
    >
      <img
        className="w-10 h-10 rounded-md object-center bg-clip-border"
        src={profileUrl}
        alt="profile"
      />
      <div className="flex flex-col w-full select-none">
        <p className="text-sm font-bold">{name}</p>
        <div className="flex gap-1">
          {imageUrl && <FontAwesomeIcon className="self-end" icon={faImage} />}
          <p className="text-xs font-medium overflow-ellipsis line-clamp-1">
            {text}
          </p>
        </div>
      </div>
      <p className="flex justify-center items-center text-xs w-7 h-5">
        {lastOnline.split(" ")[1]}
      </p>
    </div>
  );
}

ChatItem.propTypes = {
  user: PropTypes.object,
  onClick: PropTypes.func,
};

export default ChatItem;
