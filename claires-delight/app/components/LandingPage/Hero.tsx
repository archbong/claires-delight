"use client"

import { firstBanner, secondBanner, thirdBanner } from "@/public/image/cdn/cdn";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";

const slides = [
  {
    backgroundImage: `url(${firstBanner})`,
    title: "Welcome To Claire's Delight, Where Every Spice Tells a Story!!!",
    description: "Explore flavors that bring cultures to your kitchen, one pinch at a time and get ready to taste the world as our spices share their unique stories with every dish you create.",
    buttonText: "Shop Spice",
  },
  {
    backgroundImage: `url(${secondBanner})`,
    title: "Experience the Enchanting Stories Behind Every Spice At Claire's Delight !!!",
    description: "Let your culinary adventures begin as you explore flavors that transport cultures to your kitchen, one pinch at a time. Get ready to savor the world's essence through our spices.",
    buttonText: "Shop Spice",
  },
  {
    backgroundImage: `url(${thirdBanner})`,
    title: "Step Into Claire's Delight, Where Each Spice Narrates its Own Unique Tale !!!",
    description: "Prepare to unlock the unique stories behind our spices, enriching every dish you create with global inspiration. Dive into a world of diverse flavors that bring global cultures to your kitchen.",
    buttonText: "Shop Spice",
  },
];


function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000);

    return ()=> clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }
  return (
    <section className="hero relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: slides[currentSlide].backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
          transition: "background-image 1s ease-in-out",
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h1 className="mb-5 text-4xl font-semibold ">
            {slides[currentSlide].title}
          </h1>
          <p className="mt-5 mb-[5rem] font-light ">
           {slides[currentSlide].description}
          </p>
          <button className="btn font-light bg-orange w-[150px] hover:bg-green border-none"
            onClick={() => router.push('/shop-spices')}>
            {slides[currentSlide].buttonText}
          </button>
          {/* carousel button  */}
          <div className="pt-[7rem] flex justify-center">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className="mx-1">
                {currentSlide === index ? (
                  <div className="w-10 h-6 rounded-xl bg-orange" />
                ) : (
                  <FaRegCircle className="w-8 h-6 text-orange" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
