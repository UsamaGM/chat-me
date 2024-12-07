import PropTypes from "prop-types";

function Message({ message = { text: "", time: "" }, isSameUser }) {
  return (
    <div
      className={`${
        isSameUser ? "bg-green-600/25" : "bg-black/25"
      } backdrop-blur-md rounded-md w-fit p-2 mb-2 ${
        isSameUser ? "self-end" : "self-start"
      }`}
      style={{ maxWidth: "80%" }}
    >
      <p className="text-sm font-medium text-justify">{message.text}</p>
      <p
        className="text-gray-700 font-semibold text-end select-none"
        style={{ fontSize: "x-small" }}
      >
        {message.time.split(" ")[1]}
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
