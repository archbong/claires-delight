"use client";

import React, { useState } from "react";
import FooterLogo from "./DestopScreenFooterDetail/FooterLogo";
import WebsiteLinks from "./DestopScreenFooterDetail/WebsiteLinks";
import TabMobileFooterContact from "./TabScreenFooterScreen/TabFooterContact";

export default function FooterTab() {
  const [hover, setHover] = useState(false);

  return (
    <footer>
      <div
        className=" pt-[4rem] pb-[2rem] px-[4rem] bg-white   "
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: hover ? "lightGreen" : "white",
        }}
      >
        <div className="grid md:grid-cols-3 justify-between  md:space-x-[3.5rem] ">
          <FooterLogo hover={hover} />
          <TabMobileFooterContact hover={hover} />
          <WebsiteLinks />
        </div>
        <hr className="mt-10 border-[#F2F5FF]" />
        <p className="mt-10 flex justify-center text-sm">
          © {new Date().getFullYear()} Claire’sDelight. All Rights
          Reserved.{" "}
        </p>
      </div>
    </footer>
  );
}
