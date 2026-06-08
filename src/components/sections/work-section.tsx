import Image from "next/image";

type WorkSectionProps = {
  project: {
    name: string;
    thumbnail: string;
    desc: string;
  };
  index: number;
};

export function WorkSection({
  project,
  index,
}: WorkSectionProps) {
  const shouldPrioritizeImage = index === 0;

  return (
    <div className="h-full relative w-[86%] md:w-[80%] flex flex-col justify-end  gap-8">
      <div className="font-secondary absolute right-0 top-0 z-30 text-[28px] md:text-[40px] lg:text-[80px]">(0{index + 1})</div>
      <div className="font-primary font-bold text-sm md:text-lg lg:text-xl w-full text-left max-w-[70%] lg:max-w-[50%]">{project.desc}</div>
      <div className="relative aspect-[1920/1080] w-full">
        <Image
          src={project.thumbnail}
          alt={`${project.name} ${index + 1}`}
          fill
          priority={shouldPrioritizeImage}
          sizes="(min-width: 1024px) 56vw, 80vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}