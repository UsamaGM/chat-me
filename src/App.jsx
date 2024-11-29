import Left from "./components/Left/Left";
import Center from "./components/Center";
import Right from "./components/Right";

function App() {
  return (
    <>
      <div
        className="flex justify-between rounded-xl border-white/25 border-2 m-auto bg-green-400/15 backdrop-blur-lg"
        style={{ width: "85vw", height: "80vh" }}
      >
        <Left />
        <Center />
        <Right />
      </div>
    </>
  );
}

export default App;
