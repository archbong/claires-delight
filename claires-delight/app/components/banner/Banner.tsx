import Image from "next/image";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph"
import Loading from "@/app/loading";
import { Suspense } from "react";


interface BannerProps {
  image: any;
  title: string;
  subtitle: string;
}


export default function Banner({ image, title, subtitle }: Readonly<BannerProps>) {

  return (
    <div style={{
      backgroundColor: "#F6FFE9"
    }} className="w-full h-[300px] pb-5 flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 h-[300px] overflow-hidden">
  <Suspense fallback={<Loading />}>
    <Image
      src={image}
      alt="banner"
      width={800}
      height={400}
      loading="lazy"
      className="custom-shape-left object-cover w-full h-full brightness-75"
    />
  </Suspense>
</div>
     <div className="custom-shape-right relative w-full md:w-1/2 h-full flex flex-col justify-center items-start p-8 overflow-hidden">

  {/* Background logos */}
  <div className="absolute inset-0 flex flex-col justify-center items-center gap-10 opacity-10 pointer-events-none">
    <Image
      src="https://res.cloudinary.com/dzd51q99i/image/upload/v1717191258/clairesdelight/logo/Claire_s_Delight_Logo_PNG_2_ixjelq.png"
      alt="logo watermark"
      width={220}
      height={220}
    />
    <Image
      src="https://res.cloudinary.com/dzd51q99i/image/upload/v1717191258/clairesdelight/logo/Claire_s_Delight_Logo_PNG_2_ixjelq.png"
      alt="logo watermark"
      width={220}
      height={220}
    />
  </div>

  {/* Content */}
  <div className="relative z-10">
    <Title>{title}</Title>
    <Paragraph>{subtitle}</Paragraph>
  </div>

</div>
    </div>


  );
}

// banner logo
// https://res.cloudinary.com/dzd51q99i/image/upload/v1717191258/clairesdelight/logo/Claire_s_Delight_Logo_PNG_2_ixjelq.png

// banner logo
// https://res.cloudinary.com/dzd51q99i/image/upload/v1717191258/clairesdelight/logo/Claire_s_Delight_Logo_PNG_2_ixjelq.png