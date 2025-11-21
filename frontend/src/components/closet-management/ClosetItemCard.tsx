import React from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ClosetItemCardProps {
  item: ClosetItem;
  onClick?: (item: ClosetItem) => void;
  style?: React.CSSProperties;
}

export const ClosetItemCard: React.FC<ClosetItemCardProps> = ({
  item,
  onClick,
  style,
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
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "280px",
        height: "80px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        cursor: "pointer",
        ...style,
      }}
    >
      {/* Right Side: Colored background with icon overlay */}
      <div
        style={{
          width: "80px",
          height: "100%",
          backgroundColor: fallbackColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          position: "relative",
          color: textColor,
        }}
      >
        <Image
          src={`/icons/${category}.png`}
          alt={category}
          width={48}
          height={48}
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
            borderRadius: "6px",
            filter:
              textColor === "#fff"
                ? "drop-shadow(0 0 3px rgba(0,0,0,0.3))"
                : "drop-shadow(0 0 3px rgba(255,255,255,0.5))",
          }}
          onError={() => { }}
        />
      </div>

      {/* Left Side: Name + Subcategory */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name || "Unnamed"}
        </span>
        {subCategory && (
          <span
            style={{
              fontSize: "0.85em",
              color: "#555",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subCategory}
          </span>
        )}
      </div>
    </div>
  );
};
