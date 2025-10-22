import { ClosetDisplay, ClosetItem } from "@/components/ClosetDisplay";
import { OutfitDisplay, Outfit} from "@/components/OutfitDisplay";


const sampleItems: ClosetItem[] = [
  { id: "1", name: "White Hoodie", category: "outerwear", color: "#ecececff", size: "M", brand: "Levi's" },
  { id: "6", name: "Denim Jacket", category: "outerwear", color: "#8eb1e6ff", size: "M", brand: "Levi's" },
  { id: "2", name: "White Tee", category: "tops", color: "#ffffff", size: "L" },
  { id: "3", name: "Sneakers", category: "footwear", color: "#cccccc", size: "10", brand: "Nike" },
  { id: "4", name: "Jeans", category: "bottoms", color: "#111111", size: "32" },
  { id: "5", name: "Beanie", category: "accessories", color: "#ff0000", size: "One Size" },
];

const sampleOutfits: Outfit[] = [
  {
    id: "outfit1",
    name: "Outfit 1",
    items: [
      { id: "2", name: "White Tee", category: "tops", color: "#ffffff", size: "L" },
      { id: "4", name: "Jeans", category: "bottoms", color: "#111111", size: "32" },
      { id: "3", name: "Sneakers", category: "footwear", color: "#cccccc", size: "10", brand: "Nike" },
    ],
  },
  {
    id: "outfit2",
    name: "Outfit 2",
    items: [
      { id: "1", name: "White Hoodie", category: "outerwear", color: "#ecececff", size: "M", brand: "Levi's" },
      { id: "5", name: "Beanie", category: "accessories", color: "#ff0000", size: "One Size" },
      { id: "6", name: "Denim Jacket", category: "outerwear", color: "#8eb1e6ff", size: "M", brand: "Levi's" },
    ],
  },
  {
    id: "outfit3",
    name: "Outfit 3",
    items: [
      { id: "2", name: "White Tee", category: "tops", color: "#ffffff", size: "L" },
      { id: "4", name: "Jeans", category: "bottoms", color: "#111111", size: "32" },
      { id: "5", name: "Beanie", category: "accessories", color: "#ff0000", size: "One Size" },
    ],
  },
];

export default function ClosetPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Outfits</h2>
      <OutfitDisplay outfits={sampleOutfits} />
    </div>
  );
}