import Paragraph from "../../typography/Paragraph";
import Image from "next/image";

interface ServiceContentProps {
    iconImage: any;
    description: string;
}

export default function ServiceContent({ iconImage, description }: Readonly<ServiceContentProps>){

    return (
        <div className="flex items-center gap-5 p-2 m-1">
            <Image
              src={iconImage}
              alt='icon'
              height={100}
              width={100}
              className="rounded-md border border-1"
            />
            <p className="font-bold">{ description }</p>
        </div>
    );
}