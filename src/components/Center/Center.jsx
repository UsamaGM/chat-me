import PropTypes from "prop-types";

import Profile from "./Profile";
import Chat from "./Chat/Chat";
import MessageBox from "./MessageBox";

function Center({ user }) {
  return (
    <div
      className="flex flex-col py-1 text-white border-r-2 border-r-white/25"
      style={{ flex: 2 }}
    >
      <Profile user={user} />
      <Chat />
      <MessageBox />
    </div>
  );
}

Center.propTypes = {
  user: PropTypes.object,
};

export default Center;
