import Image from "next/image";
import Line1 from "@/public/image/recipe-visuals/Line 1.svg";
import Line2 from "@/public/image/recipe-visuals/Line 2.svg";

export default function Title({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex justify-center items-center gap-3 lg:gap-6">
        <Image
          src={Line1}
          alt="Line1"
          width={200}
          height={0}
          className="lg:w-[200px] h-[30px] w-[100px] md:w-[190px] "
        />
        <div className="text-1xl lg:text-2xl md:text-2xl font-semibold">{children}</div>
        <Image
          src={Line2}
          alt="Line2"
          width={200}
          height={0}
          className="lg:w-[200px] h-[30px] w-[100px] md:w-[190px]"
        />
      </div>
    </div>
  );
}
