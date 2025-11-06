import React, { useState } from "react";
import ClosetItem from "@/model/closet/ClosetItem";
import { OutfitDisplay, Outfit} from "@/components/OutfitDisplay";
import { ClosetItemCard } from "@/components/ClosetItemCard";
import { ItemDetailPopup } from "@/components/ItemDetailPopup"; 

const sampleOutfits: Outfit[] = [
  {
    id: "temp outfit 1",
    name: "Outfit 1",
    items: [
      { id: "2", name: "White Tee", category: "Tops", color: "#ffffff", size: "L" },
      { id: "4", name: "Jeans", category: "Bottoms", color: "#111111", size: "32" },
      { id: "3", name: "Sneakers", category: "Footwear", color: "#cccccc", size: "10", brand: "Nike" },
    ],
  },
  {
    id: "cozy stuff 1",
    name: "Outfit 2",
    items: [
      { id: "1", name: "White Hoodie", category: "Outerwear", color: "#ecececff", size: "M", brand: "Levi's" },
      { id: "5", name: "Beanie", category: "Accessories", color: "#ff0000", size: "One Size" },
      { id: "6", name: "Denim Jacket", category: "Outerwear", color: "#8eb1e6ff", size: "M", brand: "Levi's" },
    ],
  },
  {
    id: "hippie fit check",
    name: "Outfit 3",
    items: [
      { id: "2", name: "White Tee", category: "Tops", color: "#ffffff", size: "L" },
      { id: "4", name: "Jeans", category: "Bottoms", color: "#111111", size: "32" },
      { id: "5", name: "Beanie", category: "Accessories", color: "#ff0000", size: "One Size" },
    ],
  },
];

export default function ClosetPage() {
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);

  const handleItemClick = (item: ClosetItem) => {
    setSelectedItem(item);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Outfits</h2>

      {/* Outfit display (pass onItemClick to each ClosetDisplay inside) */}
      <OutfitDisplay outfits={sampleOutfits} onItemClick={handleItemClick} />

      {/* Single card for testing */}
      <ClosetItemCard
        item={{
          id: "1",
          name: "Winter Jacket",
          subCategory: "Puffer",
          category: "Outerwear",
          size: "M",
          color: "#3b82f6",
        }}
        onClick={handleItemClick}
      />

      {/* Popup Modal */}
      <ItemDetailPopup
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}