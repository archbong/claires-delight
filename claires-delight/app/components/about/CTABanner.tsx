"use client";

import Image from "next/image";
import Link from "next/link";

interface CTABannerProps {
  spiceImage: any;
}

export default function CTABanner({ spiceImage }: CTABannerProps) {
  return (
    <div className="relative mx-4 md:mx-20 my-30">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center relative">
        {/* IMAGE — anchored LEFT properly */}
        <div className="absolute left-20 top-1/2 -translate-y-1/2 z-10">
          <Image
            src={spiceImage}
            alt="spice image"
            width={500}
            height={380}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>

        {/* CARD */}
        <div className="t-20 w-full bg-orange rounded-2xl min-h-[280px] flex items-center pl-[624px] pr-12 py-12 relative overflow-hidden">
          {/* Background texture (optional) */}
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dzd51q99i/image/upload/v1722039604/clairesdelight/why-choose-us/Image_2_iznayf.png')`,
            }}
          />

          {/* Decorative Circles */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-white/10" />
          <div className="absolute right-24 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/10" />

          {/* CONTENT */}
          <div className="relative z-10 max-w-lg text-white">
            <p className="text-sm leading-relaxed mb-4">
              Thank you for letting us be a part of your culinary adventures and
              health journeys. Here's to many more flavorful moments together.
            </p>

            <h2 className="text-3xl font-extrabold uppercase leading-tight mb-6">
              Have Any Question About Us?
            </h2>

            <Link href="/contact">
              <button className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#E67E22] transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden bg-[#E67E22] rounded-2xl overflow-hidden">

        <div className="relative w-full h-[220px]">
          <Image
            src={spiceImage}
            alt="spice image"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

       
        <div className="p-6">
          <p className="text-white text-sm leading-relaxed mb-4">
            Thank you for letting us be a part of your culinary adventures and
            health journeys. Here's to many more flavorful moments together.
          </p>

          <h2 className="text-xl font-extrabold uppercase leading-tight text-white mb-6">
            Have Any Question About Us?
          </h2>

          <Link href="/contact">
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#E67E22] transition w-full sm:w-auto text-center">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}