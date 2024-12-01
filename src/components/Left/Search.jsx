import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

function Search() {
  return (
    <div className="flex justify-between items-center px-2 py-6 gap-3 border-b-2 border-b-white/25 w-full h-10">
      <FontAwesomeIcon icon={faSearch} />
      <input
        className="w-full bg-white/25 px-2 py-1 rounded-lg backdrop-blur-md outline-none"
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
      />
      <FontAwesomeIcon
        icon={faPlus}
        className="hover:text-black/50 hover:cursor-pointer"
      />
    </div>
  );
}

export default Search;
