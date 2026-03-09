
import BodyWrapper from "../layout/BodyWrapper";
import Paragraph from "../typography/Paragraph";
import CulinaryTitle from "../typography/CulinaryTitle";
import Image from "next/image";
import Link from "next/link";

export default function CulinaryInspiration() {
  return (
    <section className="py-16 lg:py-24">
      <BodyWrapper>
        <div className="group bg-lightGreen hover:bg-tomatoRed hover:text-white transition-all duration-500 rounded-sm overflow-hidden">

          {/* HEADER */}
          <div className="text-center pt-12 px-6">
            <CulinaryTitle>
              Our Culinary Inspirations
            </CulinaryTitle>

            <Paragraph>
              Unleash your inner chef with our easy-to-follow recipes and spice
              up your culinary selection with exciting new flavours.
            </Paragraph>
          </div>

          {/* CONTENT */}
          <div className="grid md:grid-cols-2 items-center gap-10 mt-12 px-6 pb-16">

            {/* IMAGE SIDE */}
<div className="relative flex justify-center md:justify-start">

  <div
    className="
      relative
      w-[720px] h-[720px]
      md:w-[780px] md:h-[780px]
      rounded-full
      overflow-hidden
      -ml-40
      -mb-48
      transition-transform duration-500
      group-hover:scale-105
    "
  >
    <Image
      src="https://res.cloudinary.com/dzd51q99i/image/upload/v1716381751/clairesdelight/landing-page/culinary-inspirations/Recipe_Image_ybmfed.png"
      alt="culinary"
      fill
      className="object-cover group-hover:opacity-0 transition-opacity duration-500"
    />

    <Image
      src="https://res.cloudinary.com/dzd51q99i/image/upload/v1717189992/clairesdelight/landing-page/culinary-inspirations/Recipe_1_rurwtc.png"
      alt="culinary hover"
      fill
      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />
  </div>

</div>
            {/* TEXT SIDE */}
            <div className="space-y-6 text-center md:text-left">

              <p className="max-w-lg mx-auto md:mx-0 leading-relaxed transition-colors duration-300">
                <span className="group-hover:hidden">
                  Explore our "Recipe" section, your go-to destination for
                  mouthwatering recipes and cooking tips. From simple
                  weeknight dinners to impressive feasts, we provide step-by-step
                  guidance on how to create flavoured dishes using our spices.
                  Whether you're a seasoned chef or just starting out in the
                  kitchen, our detailed instructions and helpful hints will
                  inspire confidence and creativity in every meal you make.
                </span>

                <span className="hidden group-hover:inline">
                  Delve into our "Recipes" section, your ultimate source for
                  irresistible dishes and culinary expertise. Whether you're
                  whipping up quick weeknight meals or preparing impressive
                  feasts, our step-by-step guidance ensures flavorful creations
                  using our premium spices. Whether you're a seasoned chef or
                  a kitchen novice, our detailed instructions and expert tips
                  will ignite your passion and elevate every meal you prepare.
                </span>
              </p>

              <div className="flex justify-center md:justify-start pt-4">
                <Link href="/recipes">
                  <button className="px-8 py-3 text-sm font-medium rounded-md bg-orange text-white transition-colors duration-300 group-hover:bg-green">
                    Explore Recipes
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </BodyWrapper>
    </section>
  );
}