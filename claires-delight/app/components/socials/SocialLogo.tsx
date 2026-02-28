import React from "react";
import SocialLink from "./SocialLink";
import Instagram from "@/public/image/socials/instagram.svg";
import Twitter from "@/public/image/socials/X.svg";
import Facebook from "@/public/image/socials/facebook.svg";
import Youtube from "@/public/image/socials/youtube.svg";
import Tiktok from "@/public/image/socials/Tiktok.svg";
import InstagramRed from "@/public/image/socials/instagramRed.svg";
import TwitterRed from "@/public/image/socials/Xred.svg";
import FacebookRed from "@/public/image/socials/facebookRed.svg";
import YoutubeRed from "@/public/image/socials/youtubeRed.svg";
import TiktokRed from "@/public/image/socials/TiktokRed.svg";




interface SocialLogosProps {
  hover: boolean;
}


function SocialLogos({ hover }: SocialLogosProps) {
  return (
    <div>
      <div className="flex pt-5 md:pt-0">
        <SocialLink
          href="https://www.linkedin.com/company/"
          image={hover ? InstagramRed : Instagram}
          alt="Instagram"
        />

        <SocialLink
          href="https://www.instagram.com/"
          image={hover ? TwitterRed : Twitter}
          alt="Twitter"
        />

        <SocialLink
          href="https://www.youtube.com/"
          image={hover ? YoutubeRed : Youtube}
          alt="Youtube"
        />

        <SocialLink
          href="https://www.facebook.com/groups"
          image={hover ? FacebookRed : Facebook}
          alt="Facebook"
        />

        <SocialLink
          href="https://www.facebook.com/groups"
          image={hover ? TiktokRed : Tiktok}
          alt="Tiktok"
        />
      </div>
    </div>
  );
}

export default SocialLogos;
