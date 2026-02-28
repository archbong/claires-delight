import Image from "next/image";
import Paragraph from "../../typography/Paragraph";

interface FutureServiceProps {
  imageIcon: any,
  text: string;
  className: string;
}


export default function FutureService({ imageIcon, text, className }: Readonly<FutureServiceProps>) {

  return (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <Image
        src={imageIcon}
        alt="icon"
        width={50}
        height={50}
      />
      <p className="p-5 text-center">{text}</p>
    </div>
  );
}