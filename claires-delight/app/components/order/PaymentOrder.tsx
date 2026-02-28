"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Subtitle from "@/app/components/typography/Subtitle";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import Button from "@/app/components/button/Button";
import ServiceCard from "@/app/components/LandingPage/our-service/ServiceCard";
import { useCartStore } from "@/app/store/cartStore";
import { formatNaira } from "@/lib/utils/currency";

export default function PaymentOrder() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const cartCount = useCartStore((state) => state.cartCount);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const clearCart = useCartStore((state) => state.clearCart);

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/shop-spices");
  };

  if (!items.length) {
    return (
      <BodyWrapper>
        <div className="py-16 text-center">
          <Subtitle title="No items to checkout" />
          <p className="text-tertiaryGrey mt-2 mb-6">
            Your cart is empty. Add spices before proceeding to payment.
          </p>
          <Link href="/shop-spices" className="btn bg-orange hover:bg-green text-white border-none">
            Shop Spices
          </Link>
        </div>
      </BodyWrapper>
    );
  }

  return (
    <BodyWrapper>
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/shop-spices">Shop Spices</Link>
          </li>
          <li>
            <Link href="/cart">Cart</Link>
          </li>
          <li>Checkout</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceCard className="p-5">
            <SpiceTitle title={`Review Order (${cartCount})`} />
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center rounded-xl border border-primaryGrey/50 p-3"
                >
                  <div>
                    <p className="font-semibold text-customBlack">{item.product.name}</p>
                    <p className="text-sm text-tertiaryGrey">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-customBlack">
                    {formatNaira(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </ServiceCard>
        </div>

        <div>
          <ServiceCard className="p-5">
            <SpiceTitle title="Payment Summary" />
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">{formatNaira(totalAmount)}</span>
              </div>
            </div>
            <div className="mt-5">
              <Button
                className="btn w-full bg-orange hover:bg-green text-white border-none"
                text={`Place Order (${formatNaira(totalAmount)})`}
                onClick={handlePlaceOrder}
              />
            </div>
          </ServiceCard>
        </div>
      </div>
    </BodyWrapper>
  );
}
