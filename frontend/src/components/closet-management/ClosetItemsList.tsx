import ClosetItem from "@/src/model/closet/ClosetItem";
import { ClosetItemCard } from "../cards/ClosetItemCard";

export default function ClosetItemsList({
  filteredCloset,
  selectedItem,
  setSelectedItem,
  selectedCategory,
}: {
  filteredCloset: ClosetItem[];
  selectedItem: ClosetItem | null;
  setSelectedItem: (item: ClosetItem) => void;
  selectedCategory: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {filteredCloset.length > 0 ? (
          filteredCloset.map((item: ClosetItem, idx: number) => (
            <ClosetItemCard
              key={`$${item.id}-${idx}`}
              item={item}
              onClick={setSelectedItem}
              isSelected={selectedItem?.id === item.id}
            />
          ))
        ) : (
          <div style={{ fontStyle: "italic", color: "#888" }}>
            No {selectedCategory !== "All" ? selectedCategory : "items"} found
          </div>
        )}
      </div>
    </div>
  );
}
