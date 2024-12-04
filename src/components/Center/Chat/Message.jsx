import PropTypes from "prop-types";

function Message({ message = "Hello", time = "12:00", isSameUser }) {
  return (
    <div
      className={`${
        isSameUser ? "bg-green-600/25" : "bg-black/25"
      } backdrop-blur-md rounded-md w-fit p-2 mb-2 ${
        isSameUser ? "self-end" : "self-start"
      }`}
      style={{ maxWidth: "80%" }}
    >
      <p className="text-sm text-justify">{message}</p>
      <p className="text-gray-300 text-end" style={{ fontSize: "xx-small" }}>
        {time}
      </p>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.string,
  time: PropTypes.string,
  isSameUser: PropTypes.bool,
};

export default Message;
