import ClosetItem from "@/src/model/closet/ClosetItem";
import {
  categories,
  ClosetItemCategory,
} from "@/src/model/closet/ClosetItemCategories";

export default function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  userCloset,
}: {
  selectedCategory: ClosetItemCategory | "All";
  setSelectedCategory: (category: ClosetItemCategory | "All") => void;
  userCloset: ClosetItem[];
}) {
  // Count how many items per category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] =
      userCloset.filter((item) => item.category?.trim() === category).length ||
      0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <select
      value={selectedCategory}
      onChange={(e) =>
        setSelectedCategory(e.target.value as ClosetItemCategory | "All")
      }
      className="mb-2 p-2 w-full border border-gray-300 rounded"
    >
      <option value="All">All Categories ({userCloset.length})</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category} ({categoryCounts[category]})
        </option>
      ))}
    </select>
  );
}
