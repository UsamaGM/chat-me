import Media from "./Media/Media";
import Options from "./Options/Options";
import Profile from "./Profile";

function Right() {
  return (
    <div className="flex flex-col flex-1 py-1 text-white">
      <Profile />
      <Media />
      <Options />
    </div>
  );
}

export default Right;
