import Subtitle from "../typography/Subtitle";
import { SectionIcon } from "./SectionIcon";
import arrowIcon from "@/public/image/icons/Group 89.png";

export const PhilosophyRow = ({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle?: string;
  description: string;
}) => (
  <div className="flex flex-row gap-6 md:gap-12 py-10">
    {/* Left: icon + title */}
    <div className="flex flex-col gap-2 md:w-64 flex-shrink-0">
      <div className="gap-3">
        <Subtitle icon={arrowIcon} title={title} />
        <p className="font-bold text-1xl">
         {subtitle}
        </p>
      </div>
    </div>
    <p className="text-left text-justify">{description}</p>
  </div>
);