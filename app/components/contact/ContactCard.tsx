import Image, { StaticImageData } from "next/image"

interface ContactCardProps {
    icon: any;
    children: React.ReactNode;
}

export default function ContactCard({ icon, children}: Readonly<ContactCardProps>) {

    return (
        <div className="card w-[16.9rem] h-20 rounded-xl shadow-xl">
            <div className="flex flex-row justify-center items-center gap-5 px-10">
              <Image
                src={icon}
                alt="icon"
                width={40}
                height={40}
                />
                <p className="text-pretty">{children}</p>
            </div>
        </div>
    );
}