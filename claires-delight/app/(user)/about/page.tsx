"use client";

import Image from "next/image";
import Link from "next/link";
import dottedLine from "@/public/image/about-us/Dotted Lines.png";
import spiceImage from "@/public/image/about-us/about-spices.png";
import Subtitle from "@/app/components/typography/Subtitle";
import arrowIcon from "@/public/image/icons/Group 89.png";
import HeaderText from "@/app/components/typography/HeaderText";
import Button from "@/app/components/button/Button";
import Banner from "@/app/components/banner/Banner";
import { aboutBanner, aboutImage } from "@/public/image/cdn/cdn";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import SearchProductResults from "@/app/components/Spice/SearchProductResult";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import { useProductsStore } from "@/app/store/productsStore";
import CTABanner from "@/app/components/about/CTABanner";
import { PhilosophyRow } from "@/app/components/about/PhilosophyRow";
import MissionVision from "@/app/components/about/MissionVision";

export default function Page() {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const searchResults = useProductsStore((state) => state.filteredProducts);
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <>
      {" "}
      <Navbar onSearch={handleSearch} />
      {searchTerm ? (
        <SearchProductResults results={searchResults} />
      ) : (
        <>
          <Banner
            image={aboutBanner}
            title={`About Us`}
            subtitle={`Learn more about our passion for spices,
            and commitment to quality. Discover the story behind
            our journey to bring the finest flavours to your kitchen`}
          />
          <BodyWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 place-content-center place-items-center">
              <p className="md:pl-10">
                In every jar and packet from Claire&apos;s Delight, you&apos;ll
                find more than just spices. You&apos;ll find a commitment to
                excellence. Each herb and spice is selected with the utmost
                care, ensuring they are not only rich in flavor but also adhere
                to the highest standards of hygiene and quality. Our selection
                process is rigorous, and we pride ourselves on providing
                products that are not only vibrant and flavorful but also free
                from chemicals and additives. With Claire&apos;s Delight,
                you&apos;re not just enhancing your meals; you&apos;re choosing
                a healthier, more vibrant lifestyle.
              </p>
              <Image
                src={aboutImage}
                alt="Slide" width={500}
                height={500} className="pt-5 md:pt-0" />
            </div>
            {/* Our Mission and Vision  */}

            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
              <div className="pt-5 md:p-10">

                <MissionVision
                  title="Our Mission"
                  description="At Claire&apos; Delight, our mission is to empower individuals
                  to enhance their culinary experiences and improve their
                  overall well-being through the artful selection and use of
                  herbs and spices. We strive to provide high-quality,
                  flavourful, and chemical-free products that inspire creativity
                  in the kitchen and promote a healthier lifestyle."
                />
              </div>
              <div className="pt-5 md:p-10">
                <MissionVision
                  title="Our Vision"
                  description="Our Vision at Claire&apos; Delight is to become the go-to
                  destination for individuals seeking to elevate their everyday
                  meals with the finest herbs and spices. We envision a world
                  where every kitchen is filled with the aroma of freshly ground
                  spices and every dining experience is a celebration of flavor
                  and health. Through continuous innovation, sustainable
                  practices, and a commitment to excellence, we aim to inspire
                  and delight customers around the globe."
                />
              </div>
            </div>

            <div className="grid  grid-cols-3 gap-4">
              <div className="md:p-10">
                <Image
                  src={dottedLine}
                  alt="dotted line"
                  width={220}
                  height={200}
                />
              </div>
              <div className="col-span-2">
                <PhilosophyRow
                  title="Our Philosophy"
                  subtitle="Flavourful Journey For Healthy Living"
                  description="As someone who has navigated the transformative path of health
                  and wellness through mindful eating and a balanced diet, I
                  understand the pivotal role of herbs and spices not just in
                  flavoring our meals, but in enriching our health. At
                  Claire&apos;s Delight, we don&apos;t just offer spices; we
                  offer keys to a healthier lifestyle. Whether it&apos;s through
                  our carefully crafted blends that bring out the best in every
                  meal or our specially formulated teas that soothe and
                  rejuvenate, we&apos;re here to guide you on a journey of
                  culinary exploration and well-being." />

                <PhilosophyRow title="Our Commitment"
                  subtitle=" Quality, Flavour, and Purity"
                  description="In every jar and packet from Claire&apos;s Delight,
                  you&apos;ll find more than just spices. You&apos;ll find a
                  commitment to excellence. Each herb and spice is selected with
                  the utmost care, ensuring they are not only rich in flavor but
                  also adhere to the highest standards of hygiene and quality.
                  Our selection process is rigorous, and we pride ourselves on
                  providing products that are not only vibrant and flavorful but
                  also free from chemicals & additives. With Claire&apos;s
                  Delight, you&apos;re not just enhancing your meals;
                  you&apos;re choosing a healthier, more vibrant lifestyle." />

                <PhilosophyRow title="A heartfelt Thank You !!!"
                  description=" Choosing Claire&apos;s Delight is more than just a purchase;
                  it&apos;s an entry into a community dedicated to the art of
                  flavorful and healthy living. Your trust, loyalty, and
                  enthusiasm fuel our passion and commitment to excellence.
                  Together, we&apos;re not just growing a brand; we&apos;re
                  nurturing a family of food enthusiasts and health-conscious
                  individuals eager to explore the boundless possibilities of
                  herbs and spices." />
              </div>
            </div>

            <CTABanner spiceImage={spiceImage} />
          </BodyWrapper>
        </>
      )}
      <ResponsiveFooter />
    </>
  );
}
