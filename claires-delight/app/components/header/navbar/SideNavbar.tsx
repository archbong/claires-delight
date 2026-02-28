import React from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

interface SideNavbarProps {
  onClose: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ onClose }) => {
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

  return (
    <div 
      data-testid="side-navbar"
      className="absolute right-0 top-0 bg-lighterGreen w-[70%] h-screen md:w-[300px] md:h-screen z-50 rounded-l-3xl">
      <IoClose
        onClick={onClose}
        className="text-[1.8rem] absolute top-5 right-5"
        data-testid="close-icon"
      />

      <div className="p-9">
        <div className="mt-[3rem]  ">
          {links.map((link) => (
            <Link href={link.path} key={link.title}>
              <div className="hover:text-orange border-b-[1px] pt-6 pb-2 px-3 text-xs">
                {link.title}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center mt-[5rem] ">
          <Link href="/contact">
            <button className="btn bg-orange border-none text-white font-normal text-xs hover:bg-orange ">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
