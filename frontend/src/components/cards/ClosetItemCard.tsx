import React from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ClosetItemCardProps {
  item: ClosetItem;
  onClick?: (item: ClosetItem) => void;
  isSelected?: boolean;
}

export const ClosetItemCard: React.FC<ClosetItemCardProps> = ({
  item,
  onClick,
  isSelected,
}) => {
  const { name, subCategory, category, color } = item;

  const fallbackColor = color || "#cccccc";

  const getTextColor = (bgColor: string) => {
    if (!bgColor.startsWith("#")) return "#000";

    const hex = bgColor.replace("#", "");
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;

    const r = parseInt(fullHex.substring(0, 2), 16) || 0;
    const g = parseInt(fullHex.substring(2, 4), 16) || 0;
    const b = parseInt(fullHex.substring(4, 6), 16) || 0;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "#000" : "#fff";
  };

  const textColor = getTextColor(fallbackColor);

  const router = useRouter();
  const handleClick = () => {
    onClick?.(item);
    router.push(`/closet?id=${item.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between min-w-xs h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
        isSelected ? "bg-blue-100 border-blue-500" : "bg-white"
      }`}
    >
      {/* Right Side: Colored background with icon overlay */}
      <div
        className="flex items-center justify-center h-full aspect-square rounded-l-lg"
        style={{ backgroundColor: fallbackColor, color: textColor }}
      >
        <Image
          src={`/icons/${category}.png`}
          alt={category}
          width={48}
          height={48}
          className={`w-4/5 h-4/5 object-contain rounded-md ${
            textColor === "#fff"
              ? "drop-shadow-[0_0_3px_rgba(0,0,0,0.3)]"
              : "drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]"
          }`}
          onError={() => {}}
        />
      </div>

      {/* Left Side: Name + Subcategory */}
      <div className="flex-1 p-5 flex flex-col justify-center overflow-hidden">
        <span className="font-semibold truncate">{name || "Unnamed"}</span>
        {subCategory && (
          <span className="text-sm text-gray-600 truncate">{subCategory}</span>
        )}
      </div>
    </div>
  );
};
