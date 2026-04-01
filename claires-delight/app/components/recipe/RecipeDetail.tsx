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
  // const tips = Array.isArray(item.tip) ? item.tip : []

  return (
    <>
      <section className="rounded-2xl p-2 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-start">
          <Suspense>
            <Image
              src={item?.image}
              alt={item?.title}
              width={500}
              height={500}
              loading="lazy"
              className="rounded-2xl"
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </Suspense>

          <div className="space-y-4">
            {/* Title */}
            <SpiceTitle title={item?.title} />

            {/* Description */}
            <p className="text-tertiaryGrey leading-7 text-sm">{item?.description}</p>

            {/* Stats row — subtle, inline */}
            <p className="text-sm text-tertiaryGrey">
              <span className="font-semibold text-customBlack">Difficulty:</span> {item?.difficulty ?? "Medium"}&ensp;·&ensp;
              <span className="font-semibold text-customBlack">Servings:</span> {item?.servings ?? "—"}&ensp;·&ensp;
              <span className="font-semibold text-customBlack">Cook Time:</span> {item?.cookTime ?? "—"} min
            </p>

            {/* Ingredients */}
            <div>
              <h3 className="font-bold text-lg text-customBlack mb-2">Ingredients:</h3>
              <ul className="space-y-1 text-sm text-tertiaryGrey leading-6 list-disc list-inside">
                {ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient},</li>
                ))}
              </ul>
            </div>

            {/* Method */}
            <div>
              <h3 className="font-bold text-lg text-customBlack mb-2">Method:</h3>
              <ol className="space-y-1 text-sm text-tertiaryGrey leading-6 list-decimal list-inside">
                {methods.map((method: string, index: number) => (
                  <li key={index}>{method},</li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div>
              <h3 className="font-bold text-lg text-customBlack mb-2">Tips:</h3>
              <ol className="space-y-1 text-sm text-tertiaryGrey leading-6 list-disc list-inside">
                {methods.map((method: string, index: number) => (
                  <li key={index}>{method},</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
      {/* Best Selling Spices  */}
      <div className="my-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Title>{"Best Selling Spices"}</Title>
        </div>
        <Paragraph>
          Recommended spices for you. Make a tasty and delicious meal using any
          of our spices. It is of a good quality and it is affordable
        </Paragraph>
      </div>
      <div className="max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productSlice?.map((product: Product) => (
            <Suspense key={product._id}>
              <EnhancedSpiceCard product={product} />
            </Suspense>
          ))}
        </div>
      </div>
    </>


  );
}
