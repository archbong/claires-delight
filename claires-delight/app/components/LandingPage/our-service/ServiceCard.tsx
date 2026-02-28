export default function ServiceCard({ children, className }: any){

    return (
        <div className={`card rounded-lg border border-1 ${className}`}>
            { children }
        </div>
    );
}