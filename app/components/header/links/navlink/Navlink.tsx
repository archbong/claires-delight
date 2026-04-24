"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navlink({ item }: Readonly<{ item: any }>) {
  const pathName = usePathname();

  return (
    <Link href={item.path} className={`${pathName === item.path}`}>
      <div className="">
      {item.title}
      </div>
    </Link>
  );
}
