import Image from "next/image";
import { CartItem } from "@/typings";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import Subtitle from "../typography/Subtitle";
import ServiceCard from "../LandingPage/our-service/ServiceCard";
import { IoIosStar } from "react-icons/io";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

interface Props {
  item: CartItem;
}

export default function CartItemView({ item }: Readonly<Props>) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleQuantityChange = (qty: number) => {
    const quantity = Number(qty);
    if (quantity >= 1 && item.product._id) {
      updateQuantity(item.product._id, quantity);
    }
  };

  const handleRemoveClick = () => {
    if (item.product._id) {
      removeFromCart(item.product._id);
    }
  };

  const imageSrc =
    typeof item.product.images === "string" &&
    item.product.images.trim() !== "" &&
    item.product.images !== "null" &&
    item.product.images !== "undefined"
      ? item.product.images
      : "/placeholder.svg";

  return (
    <ServiceCard className="w-full p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6 place-content-center">
        <Suspense fallback={<Loading />}>
          <div className="rounded-2xl p-1 flex md:block justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden rounded-xl bg-lighterGreen border border-primaryGrey/40 shrink-0">
              <Image
                src={imageSrc}
                alt={`${item.product.name} - Claire's Delight Spice`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 160px"
              />
            </div>
          </div>
        </Suspense>
        <div className="col-span-3 px-2 sm:px-3 md:px-0 flex flex-col gap-4">
          <Subtitle title={item.product.name} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <span className="flex text-orange">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
              </span>
              <p className="ml-2 text-sm text-tertiaryGrey">20 Reviews</p>
            </div>
            <div className="flex flex-row items-center">
              <div className="border border-primaryGrey/70 flex flex-row justify-center items-center px-1 rounded-lg bg-white">
                <button
                  className="bg-white hover:bg-gray-100 border-r p-1"
                  aria-label="decrease"
                  onClick={() => {
                    handleQuantityChange(item.quantity - 1);
                  }}
                >
                  <AiOutlineMinus />
                </button>
                <p className="bg-white border-r border-l px-2">
                  {item.quantity}
                </p>
                <button
                  className="bg-white hover:bg-gray-100 border-l p-1"
                  aria-label="increase"
                  onClick={() => {
                    handleQuantityChange(item.quantity + 1);
                  }}
                >
                  <MdOutlineAdd />
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="line-clamp-2 text-sm leading-6 text-teritaryGrey">
              {item.product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-1">
            <div>
              <p className="text-customBlack font-bold text-lg">
                {formatNaira(item.product.price * item.quantity)}
              </p>
            </div>
            <button
              onClick={handleRemoveClick}
              className="flex gap-1 items-center text-red hover:text-lightRed2 transition-colors duration-200 w-fit"
            >
              <RiDeleteBinLine /> <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </ServiceCard>
  );
}
