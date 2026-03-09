export default function ServiceCard({ children, className }: any) {
  return (
    <div className={`rounded-2xl border border-primaryGrey/50 bg-white overflow-hidden ${className}`}>
      {children}
    </div>
  );
}