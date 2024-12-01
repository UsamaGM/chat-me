import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Option({ title = "Title", icon = faSmile, onClick = () => {} }) {
  return (
    <div
      className="flex items-center gap-2 transition-transform duration-200 hover:cursor-pointer hover:scale-110 hover:translate-x-3 hover:text-black/50"
      onClick={onClick}
    >
      <FontAwesomeIcon className="size-5" icon={icon} />
      <span className="font-medium">{title}</span>
    </div>
  );
}

Option.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.object,
  onClick: PropTypes.func,
};

export default Option;
