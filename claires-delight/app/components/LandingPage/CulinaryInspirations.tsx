"use client"

import { useState } from "react";
import Link from "next/link";
import Button from "../button/Button";
import BodyWrapper from "../layout/BodyWrapper";
import Paragraph from "../typography/Paragraph";
import CulinaryTitle from "../typography/CulinaryTitle";
import Image from "next/image";

export default function CulinaryInspiration() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="md:h-[50rem] lg:h-[50rem] md:p-5 lg:p-5">
      <BodyWrapper>
        <div
          className={`bg-lightGreen hover:bg-tomatoRed hover:text-white transition duration-300 ease-in-out`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CulinaryTitle isHover={isHovered}>Our Culinary Inspirations </CulinaryTitle>
          <Paragraph>
            Unleash your inner chef with our easy-to-follow recipes and spice up
            your culinary selection with exciting new flavours
          </Paragraph>
          <div className="md:grid md:grid-cols-2 gap-4 overflow-hidden  items-center">
            <Image
              src={isHovered ? 'https://res.cloudinary.com/dzd51q99i/image/upload/v1717189992/clairesdelight/landing-page/culinary-inspirations/Recipe_1_rurwtc.png' : 'https://res.cloudinary.com/dzd51q99i/image/upload/v1716381751/clairesdelight/landing-page/culinary-inspirations/Recipe_Image_ybmfed.png'}
              alt="culinary"
              width={600}
              height={600}
              style={{
                borderRadius: "50% 50% 50% 0",
                position: "relative",
                bottom: "-47px",
                left: "-23px"
              }}
            />

            <div>
              <p
                className={`text-justify w-[331px] md:w-[523px] hover:text-white transition duration-200 ease-in-out`}
              >
                {isHovered ?
                  `Delve into our "Recipes" section, your ultimate source for irresistible dishes and culinary expertise. Whether you're whipping up quick weeknight meals or preparing impressive feasts, our step-by-step guidance ensures flavorful creations using our premium spices. Whether you're a seasoned chef or a kitchen novice, our detailed instructions and expert tips will ignite your passion and elevate every meal you prepare.` :
                  `Explore our "Recipe" section, your go-to destination for mouthwatering recipes and cooking tips. From simple weeknight dinners to impressive feasts, we provide step-by-step guidance on how to create flavoured dishes using our spices. Whether you&#39;re a seasoned chef or just starting out in the kitchen, our detailed instructions and helpful hints will inspire confidence and creativity in every meal you make.`
                }
              </p>


              <div className="flex justify-center md:mt-10 lg:mt-10">
                <Link href="/recipes">
                  <Button
                    className={`btn ${isHovered ? "bg-green" : "bg-orange"} border-none text-white font-normal text-xs`}
                    text="Explore Recipes"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BodyWrapper>
    </div>
  );
}