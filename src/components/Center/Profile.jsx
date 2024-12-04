import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faBars } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Profile({ user }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 px-2 py-1 border-b-2 border-b-white/25 w-full h-fit">
      <img
        className="w-10 h-10 rounded-md object-center bg-clip-border"
        src={user.image}
        alt="profile"
      />
      <span className="text-lg font-medium flex-1 overflow-hidden select-none max-h-6">
        {user.name}
      </span>
      <FontAwesomeIcon
        icon={faPhone}
        className="hover:text-black/50 hover:cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faVideo}
        className="hover:text-black/50 hover:cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faBars}
        className="hover:text-black/50 hover:cursor-pointer"
      />
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
