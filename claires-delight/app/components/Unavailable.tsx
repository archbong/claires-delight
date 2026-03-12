import { LuChefHat } from "react-icons/lu";

export default function Unavailable({ itemType }: { itemType: "recipes" | "spices"  | "blog posts" | "customer reviews" }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FFF8F6] border border-primaryGrey/40 mb-4">
                <LuChefHat className="text-orange text-2xl" />
            </div>

            <h3 className="text-xl font-semibold text-customBlack">
                No {itemType.charAt(0).toUpperCase() + itemType.slice(1)} Available
            </h3>

            <p className="text-tertiaryGrey mt-2 max-w-sm">
                Looks like there are no {itemType} to display right now.
                Try exploring our spices or check again later.
            </p>
        </div>
    );
}