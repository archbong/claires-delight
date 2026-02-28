"use client";

import React, { useState } from "react";
import MobileFooterLogo from "./MobileScreenFooterDetail/MobileFooterLogo";
import WebsiteLinks from "./DestopScreenFooterDetail/WebsiteLinks";
import SocialLogos from "../socials/SocialLogo";
import MobileFooterContact from "./MobileScreenFooterDetail/MobileFooterContact";

export default function FooterMobile() {
  const [hover, setHover] = useState(false);

  return (
    <div className="md:hidden">
      <div
        className=" pt-[4rem] pb-[2rem] px-[2rem] bg-white   "
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: hover ? "lightGreen" : "white",
        }}
      >
        <div className="">
          <MobileFooterLogo hover={hover} />
          <div className="flex justify-between">
            <WebsiteLinks />
            <MobileFooterContact hover={hover} />
          </div>
          <SocialLogos hover={hover} />
        </div>
        <hr className="mt-10 border-[#F2F5FF]" />
        <p className="mt-10 flex justify-center text-sm">
          © {new Date().getFullYear()} Claire’sDelight. All Rights
          Reserved.{" "}
        </p>
      </div>
    </div>
  );
}
