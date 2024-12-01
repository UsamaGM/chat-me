import Profile from "./Profile";
import Chat from "./Chat/Chat";
import MessageBox from "./MessageBox";

function Center() {
  return (
    <div
      className="flex flex-col py-1 text-white border-r-2 border-r-white/25"
      style={{ flex: 2 }}
    >
      <Profile />
      <Chat />
      <MessageBox />
    </div>
  );
}

export default Center;
