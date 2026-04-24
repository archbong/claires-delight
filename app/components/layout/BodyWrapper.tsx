


export default function BodyWrapper({ children }: Readonly<{ children: React.ReactNode }>){
    return (
        <div className="p-5 md:p-10 lg:p-10">
        { children }
        </div>
    );
}