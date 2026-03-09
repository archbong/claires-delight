import Paragraph from "../../typography/Paragraph";
import Image from "next/image";

interface ServiceContentProps {
    iconImage: any;
    description: string;
}

export default function ServiceContent({ iconImage, description }: Readonly<ServiceContentProps>) {
  return (
    <div className="flex items-center gap-3 p-4 pb-3">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl border border-primaryGrey/40 flex items-center justify-center bg-[#f9f9f9]">
        <Image
          src={iconImage}
          alt="icon"
          height={36}
          width={36}
          className="object-contain"
        />
      </div>
      <p className="font-bold text-sm text-customBlack leading-snug">{description}</p>
    </div>
  );
}