"use client";

import { useState, useEffect } from "react";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import Image from "next/image";
import {
  slideImageOne,
  slideImageTwo,
  slideImageThree,
} from "@/public/image/cdn/cdn";

const slides = [slideImageOne, slideImageTwo, slideImageThree];
const slideInterval = 10000;

function Choose() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, slideInterval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-10 md:mt-10 lg:mt-10"
    style={{
      backgroundImage: `url('https://res.cloudinary.com/dzd51q99i/image/upload/v1722039604/clairesdelight/why-choose-us/Image_2_iznayf.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Title>{"Why Choose Us"} </Title>
      <Paragraph>
        {
          "At our spice website, we prioritize quality, flavor, and purity, ensuring each product adds an exceptional touch to your dishes"
        }{" "}
      </Paragraph>
      <div className="flex flex-col-reverse md:flex-row md:justify-center items-center md:mx-8 xl:mx-12 mt-7 gap-6 md:gap-6 lg:gap-8">
        <p className="w-full md:max-w-[420px] lg:max-w-[500px] xl:max-w-[560px] text-[13px] md:text-[12px] lg:text-[13px] xl:text-[15px] leading-[14px] lg:leading-[24px] text-center md:text-start">
          In every jar and packet from Claire&apos;s Delight, you&apos;ll find
          more than just spices. You&apos;ll find a commitment to excellence.
          Each herb and spice is selected with the utmost care, ensuring they
          are not only rich in flavor but also adhere to the highest standards
          of hygiene and quality. Our selection process is rigorous, and we
          pride ourselves on providing products that are not only vibrant and
          flavorful but also free from chemicals and additives. With
          Claire&apos;s Delight, you&apos;re not just enhancing your meals;
          you&apos;re choosing a healthier, more vibrant lifestyle.
        </p>
        <div className="w-[250px] h-[250px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] xl:w-[520px] xl:h-[520px] relative overflow-hidden shrink-0 sm:order-first md:order-last lg:order-last">
          <Image
            src={slides[currentSlide]}
            alt="Slide"
            width={500}
            height={500}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Choose;
