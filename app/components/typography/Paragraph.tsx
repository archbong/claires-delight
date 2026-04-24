
export default function Paragraph({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center pb-6 pt-2">
      <p className="text-center w-full max-w-[331px] md:max-w-[400px] text-xs sm:text-sm md:text-base mb-3">
        {children}
      </p>
    </div>
  );
}