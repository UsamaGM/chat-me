function ChatItem() {
  return (
    <div className="flex justify-between items-center gap-2 ">
      <img
        className="w-10 h-10 rounded-full object-center bg-clip-border"
        src="/profile.jpg"
        alt="profile"
      />
      <div className="flex flex-wrap w-full select-none">
        <p className="text-sm font-bold">Usama Mangi</p>
        <p className="text-xs">Hello World! How are you?</p>
      </div>
      <p className="flex justify-center items-center text-xs w-7 h-5 bg-white/50 text-gray-900 select-none rounded-md">
        1
      </p>
    </div>
  );
}

export default ChatItem;
