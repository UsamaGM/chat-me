import { faBan, faRecycle, faStar } from "@fortawesome/free-solid-svg-icons";

import Option from "./Option";

function Options() {
  return (
    <div className="flex flex-col px-2 py-2 gap-2 select-none">
      <h1 className="font-bold">Additional Options</h1>
      <div className="flex flex-col px-5 gap-2">
        <Option title="Add to favourites" icon={faStar} />
        <Option title="Block" icon={faBan} />
        <Option title="Delete conversation" icon={faRecycle} />
      </div>
    </div>
  );
}

export default Options;
