import Subtitle from "../typography/Subtitle";
import arrowIcon from "@/public/image/icons/Group 89.png";

export default function MissionVision({title, description}: {title: string, description: string}) {
    return (
        <div className="pt-5 md:p-10">
                <Subtitle icon={arrowIcon} title={title} />
                <p className="md:pt-4">
                  {description}
                </p>
              </div>
    );
}