import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import StoreProvider from "./providers/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claire's Delight - Premium Spices & Culinary Inspirations",
  description: "Discover Claire's Delight, your ultimate destination for premium spices and culinary inspirations. Explore our hand-selected collection of organic spices from around the world, and elevate your cooking with authentic flavors and aromas. Unleash your inner chef with our easy-to-follow recipes and spice up your culinary selection with exciting new flavours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
