import Image from "next/image";
import Line1 from "@/public/image/recipe-visuals/Line 1.svg";
import Line2 from "@/public/image/recipe-visuals/Line 2.svg";

export default function Title({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-1 lg:gap-6">
        <Image
          src={Line1}
          alt="Line1"
          width={200}
          height={0}
          className="h-[30px] w-[60px] sm:w-[80px] md:w-[120px] lg:w-[200px]"
        />
        <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold whitespace-nowrap">
          {children}
        </div>
        <Image
          src={Line2}
          alt="Line2"
          width={200}
          height={0}
          className="h-[30px] w-[60px] sm:w-[80px] md:w-[120px] lg:w-[200px]"
        />
      </div>
    </div>
  );
}