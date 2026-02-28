import Image from "next/image";
import Line1 from "@/public/image/recipe-visuals/Line 1.png";
import Line2 from "@/public/image/recipe-visuals/Line 2.png";
import HoverLine1 from "@/public/image/recipe-visuals/hover-line1.png"
import HoverLine2 from "@/public/image/recipe-visuals/hover-line2.png"

interface CulinaryProps {
  children: React.ReactNode;
  isHover?: boolean;
}

export default function CulinaryTitle({
  children,
  isHover,
}: Readonly<CulinaryProps>) {
  return (
      <div className="flex justify-center items-center gap-3 lg:gap-6 pt-10">
        <Image
          src={isHover? HoverLine1 : Line1 }
          alt="Line1"
          width={200}
          height={0}
        />
        <div className="text-[17px] md:text-2xl font-semibold">{children}</div>
        <Image
          src={isHover? HoverLine2 : Line2}
          alt="Line2"
          width={200}
          height={0}
        />
      </div>
  );
}
