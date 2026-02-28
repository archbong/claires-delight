

interface SpiceTitleProps {
    title: string;
    className?: string;
}

export default function SpiceTitle({ title, className }: Readonly<SpiceTitleProps>){
    
    return (
        <h2 className={`card-title text-customBlack font-bold text-[20px] py-3 ${className}`}>
            {title}
        </h2>
    );
}