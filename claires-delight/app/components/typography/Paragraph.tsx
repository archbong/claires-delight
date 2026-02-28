export default function Paragraph({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center pb-6 pt-2">
      <p className="text-xs text-center w-[331px]  md:w-[523px]">{children}</p>
    </div>
  );
}
