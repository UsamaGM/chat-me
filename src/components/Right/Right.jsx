import { useState } from "react";
import { faBan, faRecycle, faStar } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

import Image from "./Image";
import Option from "./Option";

const initialMedia = [
  {
    time: "12/03/2024 08:15",
    url: "/image1.jpg",
  },
  {
    time: "12/03/2024 08:18",
    url: "/image2.jpg",
  },
  {
    time: "12/03/2024 08:25",
    url: "/image3.jpg",
  },
];

function Right({ user }) {
  const [media, setMedia] = useState(initialMedia);

  return (
    <div className="flex flex-col flex-1 py-1">
      <div className="flex flex-col items-center pb-5 gap-1 border-b-2 border-b-white/25">
        <img
          className="size-24 rounded-lg object-cover object-center mt-10"
          src={user.image}
          alt="profile"
        />
        <span className="font-bold text-md select-none">{user.name}</span>
        <span className="font-medium text-sm">{user.email}</span>
      </div>
      <div className="flex flex-col py-2">
        <p className="font-semibold text-md px-2">Media</p>
        <div className="flex overflow-x-scroll">
          {media.map((item) => (
            <Image key={item.url} src={item.url} />
          ))}
        </div>
      </div>
      <div className="flex flex-col px-2 py-2 gap-2 select-none">
        <h1 className="font-bold">Additional Options</h1>
        <div className="flex flex-col px-5 gap-2">
          <Option title="Add to favourites" icon={faStar} />
          <Option title="Block" icon={faBan} />
          <Option title="Delete conversation" icon={faRecycle} />
        </div>
      </div>
    </div>
  );
}

Right.propTypes = {
  user: PropTypes.object,
};

export default Right;
