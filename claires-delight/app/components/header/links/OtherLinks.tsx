import { useDebouncedCallback } from "use-debounce";
import React, { useState, useEffect, useRef } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearch, IoMenu } from "react-icons/io5";
import SideNavbar from "../navbar/SideNavbar";
import Link from "next/link";
import { useProductsStore } from "@/app/store/productsStore";
import { useCartStore } from "@/app/store/cartStore";

interface OtherLinksProps {
  hover: boolean;
  navbarColor: string;
  cartColor: string;
  onSearch: (query: string) => void;
}

const OtherLinks: React.FC<OtherLinksProps> = ({
  hover,
  navbarColor,
  cartColor,
  onSearch,
}) => {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);
  const updateSearchTerm = useProductsStore((state) => state.updateSearchTerm);
  const cartCount = useCartStore((state) => state.cartCount);

  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm || "");

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearchTerm = localStorage.getItem("searchTerm");
    if (storedSearchTerm) {
      setInputValue(storedSearchTerm);
      setSearchTerm(storedSearchTerm);
    }
  }, [setSearchTerm]);

  const debouncedHandleSearchChange = useDebouncedCallback((value: string) => {
    updateSearchTerm(value);
    localStorage.setItem("searchTerm", value);
    onSearch(value);
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newSearchTerm = event.target.value;
    setInputValue(newSearchTerm);
    debouncedHandleSearchChange(newSearchTerm);
  };

  return (
    <div>
      <div className="flex xl:gap-10 lg:gap-4 items-center gap-4">
        <div className="flex xl:space-x-10 lg:space-x-4 space-x-3">
          <div className="relative">
            <Link href="/cart">
              <HiOutlineShoppingCart className="text-[1.6rem]" />
            </Link>
            {cartCount > 0 && (
              <div
                className={`${cartColor} ${hover ? "bg-red" : "bg-lightGreen"} ${navbarColor ? "bg-lightGreen" : "bg-#FF0000"} text-[3px] text-white flex justify-center rounded-full absolute top-0 right-0 h-4 w-4`}
              >
                <p className="font-bold text-[14px]">{cartCount}</p>
              </div>
            )}
          </div>
          <div className="relative" ref={searchRef}>
            {showSearchInput ? (
              <div className="flex items-center relative">
                <input
                  id="navbar-search-input"
                  type="text"
                  name="search"
                  className="w-[10rem] h-7 pl-3 pr-10 rounded-2xl grow border border-secondaryGrey focus:outline-none focus:ring-1 focus:ring-secondaryGrey transition"
                  placeholder="Search"
                  value={inputValue}
                  onChange={handleSearchChange}
                />
                <IoSearch className="absolute right-3 h-5 w-5" />
              </div>
            ) : (
              <IoSearch
                className="text-[1.6rem] cursor-pointer transition-transform"
                onClick={() => setShowSearchInput(true)}
              />
            )}
          </div>
        </div>
        <Link href="/contact">
          <button className="btn xl:px-10 lg:px-5 py-1 bg-orange border-none text-white font-normal lg:text-[12px] hover:bg-orange hidden md:flex">
            Contact Us
          </button>
        </Link>
        <IoMenu
          className="flex md:hidden text-[1.8rem]"
          onClick={() => setShowSideNavbar(true)}
        />
        {showSideNavbar && <SideNavbar onClose={() => setShowSideNavbar(false)} />}
      </div>
    </div>
  );
};

export default OtherLinks;
