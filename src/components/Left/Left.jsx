import Profile from "./Profile";
import Search from "./Search";
import ChatList from "./ChatList/ChatList";

function Left() {
  return (
    <div className="flex flex-col flex-1 pt-1 text-white border-r-2 border-r-white/25">
      <Profile />
      <Search />
      <ChatList />
    </div>
  );
}

export default Left;
