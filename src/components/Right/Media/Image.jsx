import PropTypes from "prop-types";

function Image({ src }) {
  return (
    <img
      className="rounded-md size-20 m-2 object-cover object-center transition-transform duration-200 hover:scale-110"
      src={src}
      alt="Image"
    />
  );
}

Image.propTypes = {
  src: PropTypes.string,
};

export default Image;
