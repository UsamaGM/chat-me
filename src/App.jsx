import { useState } from "react";

import Left from "./components/Left/Left";
import Center from "./components/Center/Center";
import Right from "./components/Right/Right";

function App() {
  const user = {
    id: "1",
    name: "Usama Mangi",
    email: "usamamangi.fl@gmail.com",
    image: "/profile.jpg",
  };

  const [currentChat, setCurrentChat] = useState(null);

  return (
    <>
      <div
        className="flex justify-between rounded-xl border-white/25 border-2 m-auto bg-green-400/15 backdrop-blur-2xl"
        style={{ width: "90vw", height: "90vh" }}
      >
        <Left user={user} setCurrentChat={(userId) => setCurrentChat(userId)} />
        <Center user={user} currentChat={currentChat} />
        <Right user={user} />
      </div>
    </>
  );
}

export default App;
