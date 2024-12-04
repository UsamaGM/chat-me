import PropTypes from "prop-types";

import Media from "./Media/Media";
import Options from "./Options/Options";
import Profile from "./Profile";

function Right({ user }) {
  return (
    <div className="flex flex-col flex-1 py-1 text-white">
      <Profile user={user} />
      <Media />
      <Options />
    </div>
  );
}

Right.propTypes = {
  user: PropTypes.object,
};

export default Right;
