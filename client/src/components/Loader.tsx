function Loader({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const getSize = () => {
    switch (size) {
      case "small":
        return "scale-75";
      case "large":
        return "scale-125";
      default:
        return "scale-100";
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className={`google-g ${getSize()}`}>
        <div className="google-dot dot-blue"></div>
        <div className="google-dot dot-red"></div>
        <div className="google-dot dot-yellow"></div>
        <div className="google-dot dot-green"></div>
      </div>
    </div>
  );
}

export default Loader;
