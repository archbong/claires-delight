"use client";

import React, { useState } from "react";
import FooterLogo from "./DestopScreenFooterDetail/FooterLogo";
import FooterContact from "./DestopScreenFooterDetail/FooterContact";
import WebsiteLinks from "./DestopScreenFooterDetail/WebsiteLinks";
import Location from "./DestopScreenFooterDetail/Location";

export default function Footer() {
  const [hover, setHover] = useState(false);

  return (
    <footer className="hidden lg:block">
      <div
        className=" pt-[4rem] pb-[2rem] px-[4rem] bg-white/95 hover:bg-green/65"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="grid lg:grid-cols-4  justify-between xl:space-x-[10rem] lg:space-x-[5rem] md:space-x-[4rem] ">
          <FooterLogo hover={hover} />
          <FooterContact hover={hover} />
          <WebsiteLinks />
          <Location />
        </div>
        <hr className="mt-10 border-[#F2F5FF]"/>
        <p className="mt-10 flex justify-center text-sm">© {new Date().getFullYear()} Claire’sDelight. All Rights Reserved. </p>
      </div>
    </footer>
  );
}
