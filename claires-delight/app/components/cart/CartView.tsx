"use client";

import Image from "next/image";
import CartItemView from "./CartItem";
import { useRouter } from "next/navigation";
import Subtitle from "../typography/Subtitle";
import Button from "../button/Button";
import ServiceCard from "../LandingPage/our-service/ServiceCard";
import SpiceTitle from "../Spice/SpiceTitle";
import { cartImage } from "@/public/image/cdn/cdn";
import Link from "next/link";
import BodyWrapper from "../layout/BodyWrapper";
import { CartItem } from "@/typings";
import { useEffect } from "react";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

export default function CartView() {
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.totalAmount);
  const cartCount = useCartStore((state) => state.cartCount);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartTotal", JSON.stringify(cartTotal));
    localStorage.setItem("cartCount", JSON.stringify(cartCount));
  }, [cartItems, cartTotal, cartCount]);

  return (
    <BodyWrapper>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href="/shop-spices">Shop Spices</Link>
          </li>
          <li>All Spices</li>
          <li className="font-blog">My Cart</li>
        </ul>
      </div>
      {cartItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-5 h-[30rem]">
          <Image src={cartImage} alt="carting" width={300} height={200} />
          <Subtitle title="Empty Cart" />
          <p>Use the button below to shop for spices and add to your cart</p>
          <Button
            className="btn xl:px-10 lg:px-5 py-1 bg-orange border-none text-white font-normal lg:text-[12px] hover:bg-orange hidden md:flex"
            text="Shop spices"
            onClick={() => router.push(`/shop-spices`)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 place-content-center">
          <div className="col-span-2">
            <SpiceTitle title={`Spices in cart (${cartCount})`} />
            {cartItems.map((item: CartItem) => (
              <div key={item.product._id} className="pb-3">
                <CartItemView item={item} />
              </div>
            ))}
          </div>
          <div className="pt-[3rem]">
            <ServiceCard>
              <div className="p-5">
                <SpiceTitle title="CART SUMMARY" />
                <div className="flex justify-between items-center">
                  <p>Amount</p>
                  <SpiceTitle title={formatNaira(cartTotal)} />
                </div>
                <div className="flex justify-between items-center">
                  <p>Discount</p>
                  <SpiceTitle title={`₦00.00`} />
                </div>
                <hr className="px-5" />
                <div className="flex justify-between items-center">
                  <p>Total Amount</p>
                  <SpiceTitle title={formatNaira(cartTotal)} />
                </div>
                <div className="flex justify-center p-10">
                  <Button
                    className="btn xl:px-10 lg:px-5 py-1 bg-orange border-none text-white font-normal lg:text-[12px] hover:bg-orange hidden md:flex"
                    text={`Checkout (${formatNaira(cartTotal)})`}
                    onClick={() => router.push("/payment-process")}
                  />
                </div>
              </div>
            </ServiceCard>
          </div>
        </div>
      )}
    </BodyWrapper>
  );
}
