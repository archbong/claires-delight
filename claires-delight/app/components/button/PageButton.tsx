import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface PageButtonProps {
  onNext: () => void;
  onPrev: () => void;
}

function PageButton({ onNext, onPrev }: Readonly<PageButtonProps>) {
  return (
    <div className="flex gap-5 justify-center mt-5">
      <button className="w-[30px] h-[30px] rounded-full bg-lightOrange flex justify-center items-center"
      onClick={onPrev}
      >
        <FaArrowLeft className=" text-orange " />
      </button>
      <button className="w-[30px] h-[30px] rounded-full bg-orange flex justify-center items-center"
      onClick={onNext}
      >
        <FaArrowRight className="text-white" />
      </button>
    </div>
  );
}

export default PageButton;
