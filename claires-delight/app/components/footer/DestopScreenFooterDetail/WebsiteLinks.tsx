"use client";

import React from "react";
import Link from "next/link";

interface Link {
  title: string;
  path: string;
}

function WebsiteLinks() {
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
      title: "Contact Us",
      path: "/contact",
    },
  ];

  return (
    <div>
      <h3 className="font-bold xl:text-xl text-lg">Website Links</h3>
      {links.map((link) => (
        <div key={link.title} className="my-4 xl:text-sm text-xs">
          <Link href={link.path}>
            <div className="hover:text-red transition duration-300 ">
              {link.title}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default WebsiteLinks;
