import { ClosetDisplay, ClosetItem } from "@/components/ClosetDisplay";

export interface Outfit {
  id: string;
  name: string;
  items: ClosetItem[];
}

export const OutfitDisplay: React.FC<{ outfits: Outfit[] }> = ({ outfits }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 slots per row
        gap: "24px",
      }}
    >
      {outfits.map((outfit) => (
        <div
          key={outfit.id}
          style={{
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "12px",
            backgroundColor: "#f8f8f8",
          }}
        >
          {/* Outfit Title */}
          <h3 style={{ textAlign: "center", marginBottom: "8px" }}>{outfit.name}</h3>

          {/* Reuse ClosetDisplay for each outfit’s items */}
          <ClosetDisplay items={outfit.items} />
        </div>
      ))}
    </div>
  );
};
