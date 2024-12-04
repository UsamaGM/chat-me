import PropTypes from "prop-types";

function Profile({ user }) {
  return (
    <div className="flex flex-col items-center pb-5 gap-1 border-b-2 border-b-white/25">
      <img
        className="size-24 rounded-lg object-cover object-center mt-10"
        src={user.image}
        alt="profile"
      />
      <span className="font-bold text-md select-none">{user.name}</span>
      <span className="font-medium text-sm">{user.email}</span>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
