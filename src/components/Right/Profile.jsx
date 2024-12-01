function Profile() {
  return (
    <div className="flex flex-col items-center pb-5 gap-1 border-b-2 border-b-white/25">
      <img
        className="size-24 rounded-lg object-cover object-center mt-10"
        src="/profile.jpg"
        alt="profile"
      />
      <span className="font-bold text-md select-none">Usama Mangi</span>
      <span className="font-medium text-sm">usamapk7861@gmail.com</span>
    </div>
  );
}

export default Profile;
