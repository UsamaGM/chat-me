import Image from "./Image";

function Media() {
  return (
    <div className="flex flex-col py-2">
      <p className="font-semibold text-md px-2">Media</p>
      <div className="flex overflow-x-scroll">
        <Image src="/image1.jpg" />
        <Image src="/image2.jpg" />
        <Image src="/image3.jpg" />
      </div>
    </div>
  );
}

export default Media;
