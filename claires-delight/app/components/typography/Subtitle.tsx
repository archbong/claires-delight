import Image from "next/image";

interface SubtitleProps {
    icon?: any;
    title: string;
}


export default function Subtitle({ icon, title }: Readonly<SubtitleProps>){

    return (
        <div className="flex gap-2">
            { icon ? (<Image
              src={icon}
              alt='icon'
              width={40}
              height={40}
            />) : null }
            <div className=" text-[17px] md:text-2xl font-semibold">{title}</div>
        </div>
    );
}