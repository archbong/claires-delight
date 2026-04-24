"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Link {
  title: string;
  path: string;
}

export default function Links() {
  const links = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Shop Spices",
      path: "/shop-spices",
    },
    {
      title: "Recipes",
      path: "/recipes",
    },
    {
      title: "About Us",
      path: "/about",
    },

    {
      title: "Blog",
      path: "/blog",
    },
  ];


  const pathname = usePathname();

  return (
    <div className="hidden md:flex  ">
      <div className="flex xl:space-x-[5rem] lg:space-x-[3rem] space-x-[1.6rem]">
        {links.map((link) => (
          <Link
            href={link.path}
            key={link.title}
            className={`${
              pathname === link.path
                ? "text-red font-bold"
                : "text-black hover:text-orange"
            }`}
          >
            <div className="hover:text-red transition duration-300 md:text-sm xl:text-base text-sm">
              {link.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
