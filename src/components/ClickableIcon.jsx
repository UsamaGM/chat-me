import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

function ClickableIcon({ icon, className, onClick = () => {} }) {
  return (
    <FontAwesomeIcon
      className={`hover:text-black/50 hover:cursor-pointer transition-transform duration-200 hover:scale-125 ${className}`}
      icon={icon}
      onClick={onClick}
    />
  );
}

ClickableIcon.propTypes = {
  icon: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ClickableIcon;
