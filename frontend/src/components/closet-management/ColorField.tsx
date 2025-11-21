import ClosetItem from "@/src/model/closet/ClosetItem";
import { HexColorPicker } from "react-colorful";

// Hex ↔ RGB helpers
const hexToRgb = (hex: string) => {
  const cleaned = hex.replace("#", "").slice(0, 6);
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

export default function ColorField({
  selectedItem,
  handleFieldChange,
}: {
  selectedItem: { color: string };
  handleFieldChange: (field: keyof ClosetItem, value: string) => void;
}) {
  const handleRgbChange = (r: number, g: number, b: number) => {
    handleFieldChange("color", rgbToHex(r, g, b));
  };
  return (
    <div>
      <input
        type="text"
        value={selectedItem.color}
        onChange={(e) => handleFieldChange("color", e.target.value)}
      />
      <p></p>
      <HexColorPicker
        color={selectedItem.color}
        onChange={(c) => handleFieldChange("color", c)}
      />
      {/* RGB Inputs */}
      <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
        {["r", "g", "b"].map((ch, i) => {
          const rgb = selectedItem.color
            ? hexToRgb(selectedItem.color)
            : hexToRgb("000000");
          return (
            <input
              key={ch}
              type="number"
              min={0}
              max={255}
              value={[rgb.r, rgb.g, rgb.b][i]}
              onChange={(e) => {
                const val = Math.max(0, Math.min(255, Number(e.target.value)));
                if (ch === "r") handleRgbChange(val, rgb.g, rgb.b);
                if (ch === "g") handleRgbChange(rgb.r, val, rgb.b);
                if (ch === "b") handleRgbChange(rgb.r, rgb.g, val);
              }}
              style={{ width: "50px" }}
            />
          );
        })}
      </div>
    </div>
  );
}
