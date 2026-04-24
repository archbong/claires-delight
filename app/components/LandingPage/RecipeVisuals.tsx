import React, { Suspense } from "react";
import Title from "../typography/Title";
import Image from "next/image";
import Paragraph from "../typography/Paragraph";
import Loading from "@/app/loading";
import BodyWrapper from "../layout/BodyWrapper";
import { recipesImage } from "./recipeImages";


function RecipeVisuals() {

  return (
    <BodyWrapper>
      <Title>{"Recipe Visuals"} </Title>
      <Paragraph>
        {"Read what our satisfied customers have to say about their experience with our spices, and discover why they keep coming back for more."}
      </Paragraph>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 xl:px-[6rem] md:px-[5rem] p-5">
        {recipesImage?.map((link) => (
          <div key={link.id} className=" ">
            <Suspense fallback={<Loading />}>
              <Image
                src={`${link.imageURL}`}
                alt="Food"
                width={235}
                height={259}
                className=" rounded-xl"
              />
            </Suspense>
          </div>
        ))}
      </div>
    </BodyWrapper>
  );
}

export default RecipeVisuals;
