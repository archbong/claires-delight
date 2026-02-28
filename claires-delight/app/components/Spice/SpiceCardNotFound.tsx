import Loading from "@/app/loading";
import Image from "next/image"
import Link from "next/link";
import { Suspense } from "react";

export default function SpiceCardNotProduct() {

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div
            className="card card-compact w-[20rem] lg:w-[18rem] xl:w-[24rem] bg-base-100 shadow-md border-[1px] "

        >
            <figure className="bg-[#FFF8F6]">
                <Suspense fallback={<Loading />}>

                    <Image
                        src={`https://res.cloudinary.com/dzd51q99i/image/upload/v1722197593/clairesdelight/productNotFound/a_product_not_found_image_on_spices_tdtz4p.jpg`}
                        alt="Spice"
                        width={380}
                        height={380}
                    />
                </Suspense>
            </figure>

            <div className="card-body">
                <Link href={`/shop-spices/$`}>
                    <h2 className="card-title text-customBlack font-bold text-[20px] py-3 hover:text-orange">
                        Product not found
                    </h2>
                </Link>
                <div className="card-actions flex justify-between items-center">
                    <p className="text-customBlack font-bold text-[25px] ">
                        {" "}
                        ₦
                        No Price
                    </p>
                    <button
                        className="btn font-light text-white bg-orange w-[130px] hover:bg-green border-none"
                        onClick={handleReload}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    );
}