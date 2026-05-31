import Image from "next/image";

export const ShowSection = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4">
      <div className="text-8xl">gAlleRy</div>
      <Image src="/images/kendrick-avatar.jpg" alt="" width={200} height={200} />
    </div>
  );
}