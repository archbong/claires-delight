import Link from "next/link";
import Image from "next/image";
import { PhilosophyRow } from "./PhilosophyRow";
import { SectionIcon } from "./SectionIcon";

export default function AboutPageBody({
  aboutImage,
  spiceImage,
  arrowIcon,
}: {
  aboutImage: any;
  spiceImage: any;
  arrowIcon: any;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
 
      {/* ── Intro Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8 items-center py-10">
        <p className="text-gray-600 text-sm leading-relaxed md:w-1/2">
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
 
        {/* Circular image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
            <Image
              src={aboutImage}
              alt="About Claire's Delight"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
 
      {/* ── Mission & Vision ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
        {/* Mission */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SectionIcon />
            <span className="font-bold text-base">Our Mission</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            At Claire&apos;s Delight, our mission is to empower individuals to
            enhance their culinary experiences and improve their overall
            well-being through the artful selection and use of herbs and
            spices. We strive to provide high-quality, flavourful, and
            chemical-free products that inspire creativity in the kitchen and
            promote a healthier lifestyle.
          </p>
        </div>
 
        {/* Vision */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SectionIcon />
            <span className="font-bold text-base">Our Vision</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our Vision at Claire&apos;s Delight is to become the go-to
            destination for individuals seeking to elevate their everyday meals
            with the finest herbs and spices. We envision a world where every
            kitchen is filled with the aroma of freshly ground spices and every
            dining experience is a celebration of flavor and health. Through
            continuous innovation, sustainable practices, and a commitment to
            excellence, we aim to inspire and delight customers around the
            globe.
          </p>
        </div>
      </div>
 
      {/* ── Philosophy, Commitment, Thank You ────────────────────────────── */}
      <div className="py-4">
        <PhilosophyRow
          title="Our Philosophy"
          subtitle="Flavorful Journeys for Healthy Living"
          description="As someone who has navigated the transformative path of health and wellness through mindful eating and a balanced diet, I understand the pivotal role of herbs and spices not just in flavoring our meals, but in enriching our health. At Claire's Delight, we don't just offer spices; we offer keys to a healthier lifestyle. Whether it's through our carefully crafted blends that bring out the best in every meal or our specially formulated teas that soothe and rejuvenate, we're here to guide you on a journey of culinary exploration and well-being."
        />
 
        <PhilosophyRow
          title="Our Commitment"
          subtitle="Quality, Flavor, and Purity"
          description="In every jar and packet from Claire's Delight, you'll find more than just spices. You'll find a commitment to excellence. Each herb and spice is selected with the utmost care, ensuring they are not only rich in flavor but also adhere to the highest standards of hygiene and quality. Our selection process is rigorous, and we pride ourselves on providing products that are not only vibrant and flavorful but also free from chemicals & additives. With Claire's Delight, you're not just enhancing your meals; you're choosing a healthier, more vibrant lifestyle."
        />
 
        <PhilosophyRow
          title="A Heartfelt Thank You !!!"
          description="Choosing Claire's Delight is more than just a purchase; it's an entry into a community dedicated to the art of flavorful and healthy living. Your trust, loyalty, and enthusiasm fuel our passion and commitment to excellence. Together, we're not just growing a brand; we're nurturing a family of food enthusiasts and health-conscious individuals eager to explore the boundless possibilities of herbs and spices."
        />
      </div>
 
      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <div className="relative bg-orange-500 rounded-2xl overflow-hidden my-10 min-h-[280px] flex items-center">
        {/* Spice image — left overlapping */}
        <div className="absolute left-0 bottom-0 w-48 md:w-72 h-full">
          <Image
            src={spiceImage}
            alt="Spices"
            fill
            className="object-cover object-right"
          />
        </div>
 
        {/* Text content — pushed right */}
        <div className="ml-auto w-full md:w-3/5 p-8 md:p-10 relative z-10">
          <p className="text-white text-sm mb-3 leading-relaxed">
            Thank you for letting us be a part of your culinary adventures and
            health journeys. Here&apos;s to many more flavorful moments
            together.
          </p>
          <h2 className="text-white font-extrabold text-xl md:text-2xl uppercase leading-tight mb-6">
            Have Any Question About Us?
          </h2>
          <Link href="/contact">
            <button className="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-orange-500 transition-colors text-sm font-medium">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
 
    </div>
  );
}