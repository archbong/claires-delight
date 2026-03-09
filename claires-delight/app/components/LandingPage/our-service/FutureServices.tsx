import Image from "next/image";
import Paragraph from "../../typography/Paragraph";

interface FutureServiceProps {
  imageIcon: any,
  text: string;
}


export default function FutureService({ imageIcon, text }: Readonly<FutureServiceProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5">
      <Image
        src={imageIcon}
        alt="icon"
        width={44}
        height={44}
        className="object-contain"
      />
      <p className="text-sm text-center text-customBlack leading-snug">{text}</p>
    </div>
  );
}