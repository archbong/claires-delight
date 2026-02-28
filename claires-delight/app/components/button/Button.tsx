interface ButtonProps {
    className: string;
    text: string;
    icon?: React.ReactNode
    type?: any;
    onClick?: () => void;
}


export default function Button ({ className, type, text, icon, onClick }: Readonly<ButtonProps>){
    return (
        <button type={type} onClick={onClick} className={`${className}`}>
            { text }
        </button>
    );
}