"use client";

import React, { useState } from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import { ClosetItemCard } from "./ClosetItemCard";
import Outfit from "../../model/Outfit";

interface OutfitCardProps {
  outfit: Outfit;
  closetMap: Record<string, ClosetItem>;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, closetMap }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const outfitItems = outfit.itemIds
    ?.map((id) => closetMap[id])
    .filter(Boolean) as ClosetItem[];

  return (
    <div className="border border-gray-300 rounded-xl shadow bg-white w-full flex flex-col overflow-hidden">
      <button
        onClick={toggleOpen}
        className="w-full px-5 py-4 flex justify-between items-center text-left"
      >
        <span className="text-lg font-semibold truncate">{outfit.name || "Unnamed Outfit"}</span>
        <span className="text-gray-600 text-xl">{isOpen ? "▲" : "▼"}</span>
      </button>

      {outfit.desc && (
        <div className="px-5 pb-4 text-gray-600 text-sm">
          {outfit.desc}
        </div>
      )}

      {isOpen && (
        <div className="px-5 pb-5 flex flex-col gap-4">
          {outfitItems.map((item) => (
            <div key={item.id} className="w-full">
              <ClosetItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
