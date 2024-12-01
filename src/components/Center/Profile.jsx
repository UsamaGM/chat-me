import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faBars } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 px-2 py-1 border-b-2 border-b-white/25 w-full h-fit">
      <img
        className="w-10 h-10 rounded-md object-center bg-clip-border"
        src="/profile.jpg"
        alt="profile"
      />
      <span className="text-lg font-medium flex-1 overflow-hidden select-none max-h-6">
        Usama Mangi
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

export default Profile;
