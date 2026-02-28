"use client";

import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import { Suspense } from "react";
import Image from "next/image";
import EnhancedSpiceCard from "../Spice/EnhancedSpiceCard";
import { Product } from "@/typings";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import { useProductsStore } from "@/app/store/productsStore";

export default function RecipeDetail({ item }: any) {
  const products = useProductsStore((state) => state.products);
  const productSlice = products.slice(0, 6);
  const ingredients = Array.isArray(item?.ingredients) ? item.ingredients : [];
  const methods = Array.isArray(item?.method) ? item.method : [];

  return (
    <>
      <section className="rounded-3xl border border-primaryGrey/60 bg-white/90 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Suspense>
          <Image
            src={item?.image}
            alt={item?.title}
            width={800}
            height={500}
            loading="lazy"
            className="rounded-3xl border border-primaryGrey/40"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </Suspense>
        <div className="space-y-5">
          <SpiceTitle title={item?.title} />
          <p className="text-tertiaryGrey leading-7">{item?.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#FFF8F6] border border-primaryGrey/50 p-3">
              <p className="text-xs uppercase text-tertiaryGrey">Difficulty</p>
              <p className="font-semibold text-customBlack">{item?.difficulty ?? "Medium"}</p>
            </div>
            <div className="rounded-xl bg-[#FFF8F6] border border-primaryGrey/50 p-3">
              <p className="text-xs uppercase text-tertiaryGrey">Servings</p>
              <p className="font-semibold text-customBlack">{item?.servings ?? "-"}</p>
            </div>
            <div className="rounded-xl bg-[#FFF8F6] border border-primaryGrey/50 p-3">
              <p className="text-xs uppercase text-tertiaryGrey">Cook Time</p>
              <p className="font-semibold text-customBlack">{item?.cookTime ?? "-"} min</p>
            </div>
          </div>
          <h3 className="font-bold pt-2 text-2xl text-customBlack">Ingredients</h3>
          <ul className="space-y-2">
            {ingredients.map((ingredient: string, index: number) => (
              <li key={index} className="rounded-lg border border-primaryGrey/40 bg-[#fcfcfc] px-3 py-2">
                {ingredient}
              </li>
            ))}
          </ul>
          <h3 className="font-bold pt-2 text-2xl text-customBlack">Method</h3>
          <ol className="space-y-2">
            {methods.map((step: string, index: number) => (
              <li
                key={index}
                className="rounded-lg border border-primaryGrey/40 bg-white px-3 py-2 flex gap-3"
              >
                <span className="font-semibold text-orange min-w-5">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </section>
      <div className="my-12">
        <Title>{"Best Selling Spices"}</Title>
        <Paragraph>
          Recommended spices for you. Make a tasty and decilious meal using any
          of our spices. It is of a good quality and it is affordable
        </Paragraph>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center place-content-center">
        {productSlice?.map((product: Product) => (
          <Suspense key={product._id}>
            <EnhancedSpiceCard product={product} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
