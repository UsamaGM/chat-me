import PropTypes from "prop-types";

function Message({ isSameUser }) {
  return (
    <div
      className={`${
        isSameUser ? "bg-green-600/25" : "bg-black/25"
      } backdrop-blur-md rounded-md w-4/5 p-2 mb-2 ${
        isSameUser ? "self-end" : "self-start"
      }`}
    >
      <p className="text-xs text-justify">
        Hello World! Hope you all are doing well. This is Usama Mangi here to
        tell you that you really do matter. Maybe not to me, maybe not yourself,
        but there is someone who really does care about you. For that person,
        you really need to live!
      </p>
    </div>
  );
}

Message.propTypes = {
  isSameUser: PropTypes.bool,
};

export default Message;
