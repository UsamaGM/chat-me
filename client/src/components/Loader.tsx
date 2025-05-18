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
    <div className={`m-auto w-fit min-h-12 ${getSize()}`}>
      <div className="google-dot dot-blue" />
      <div className="google-dot dot-red" />
      <div className="google-dot dot-yellow" />
      <div className="google-dot dot-green" />
    </div>
  );
}

export default Loader;
