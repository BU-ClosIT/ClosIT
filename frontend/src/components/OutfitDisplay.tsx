import React, { useEffect, useState, useRef } from "react";
import { ClosetDisplay } from "@/components/ClosetDisplay";
import ClosetItem from "@/model/closet/ClosetItem";

export interface Outfit {
  id: string;
  name: string;
  items: ClosetItem[];
}

interface OutfitDisplayProps {
  outfits: Outfit[];
  onItemClick?: (item: ClosetItem) => void;
  headerHeight?: number; // optional if you have a header
}

export const OutfitDisplay: React.FC<OutfitDisplayProps> = ({
  outfits,
  onItemClick,
  headerHeight = 80,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerHeight = window.innerHeight - headerHeight;

      const baseBoxHeight = 835; // base height of each outfit card
      const newScale = Math.min(1, containerHeight / baseBoxHeight); // scale down if needed
      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [headerHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: `${24 * scale}px`,
        justifyItems: "center",
        alignItems: "start",
      }}
    >
      {outfits.map((outfit) => (
        <div
          key={outfit.id}
          style={{
            width: "400px",   // keep base width
            height: "835px",  // base height
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "12px",
            backgroundColor: "#f8f8f8",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "8px" }}>{outfit.name}</h3>
          <ClosetDisplay items={outfit.items} onItemClick={onItemClick} />
        </div>
      ))}
    </div>
  );
};
