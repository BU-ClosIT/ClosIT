import React from "react";
import ClosetItem from "@/model/closet/ClosetItem";

interface ClosetDisplayProps {
  items: ClosetItem[];
  onItemClick?: (item: ClosetItem) => void;
}

const categories = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Legwear",
  "Footwear",
  "Accessories",
  "Bags",
  "Misc",
];

// Determine if text should be black or white based on background color
function getTextColor(bgColor: string) {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#ffffff";
}

export const ClosetDisplay: React.FC<ClosetDisplayProps> = ({ items, onItemClick }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {categories.map((category) => {
        const itemsInCategory = items.filter((item) => item.category === category);

        return (
          <div key={category} style={{ display: "flex", alignItems: "center", gap: "12px", }}>
            {/* Category Icon */}
            <div style={{ width: "80px", height: "80px", flexShrink: 0, borderRadius: "8px", overflow: "hidden", }}>
              <img
                src={`/icons/${category}.png`} // Put icons in public/icons/
                alt={category}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* Items Row */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {itemsInCategory.length > 0 ? (
                itemsInCategory.map((item) => {
                  const textColor = getTextColor(item.color);
                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        borderRadius: "8px",
                        backgroundColor: item.color,
                        border: "1px solid #ccc",
                        color: textColor,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "12px",
                        textAlign: "center",
                        cursor: "pointer",
                        textShadow: `
                          -1px -1px 0 ${textColor === "#ffffff" ? "#000" : "#fff"},
                          1px -1px 0 ${textColor === "#ffffff" ? "#000" : "#fff"},
                          -1px 1px 0 ${textColor === "#ffffff" ? "#000" : "#fff"},
                          1px 1px 0 ${textColor === "#ffffff" ? "#000" : "#fff"}
                        `,
                      }}
                    >
                      {/* Item Name */}
                      <span style={{ fontWeight: "bold" }}>{item.name}</span>

                      {/* Optional subcategory */}
                      {item.subCategory && <span style={{ fontStyle: "italic", fontSize: "10px" }}>{item.subCategory}</span>}

                      {/* Hex color display */}
                        <span style={{ fontSize: "10px", fontFamily: "monospace" }}>
                            {item.color}
                        </span>

                      {/* Tooltip for additional info */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          marginBottom: "4px",
                          width: "160px",
                          backgroundColor: "rgba(0,0,0,0.85)",
                          color: "#fff",
                          fontSize: "10px",
                          borderRadius: "4px",
                          padding: "4px",
                          opacity: 0,
                          pointerEvents: "none",
                          transition: "opacity 0.2s",
                        }}
                        className="tooltip"
                      >
                        {item.brand && <div>Brand: {item.brand}</div>}
                        {item.size && <div>Size: {item.size}</div>}
                        {item.material && <div>Material: {item.material}</div>}
                        {item.purchaseDate && <div>Purchased: {item.purchaseDate}</div>}
                        {item.notes && <div>Notes: {item.notes}</div>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ fontStyle: "italic", color: "#888" }}>none</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
