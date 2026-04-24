


export default function HeaderText ({ children }: Readonly<{ children: React.ReactNode }>){
    return (
        <div className="text-4xl font-semibold text-white">
            { children }
        </div>
    );
}