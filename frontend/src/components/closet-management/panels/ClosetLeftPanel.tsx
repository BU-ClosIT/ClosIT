import { useState } from "react";
import Loader from "../../shared/Loader";
import { ClosetItemCategory } from "../../../model/closet/ClosetItemCategories";
import ClosetItem from "../../../model/closet/ClosetItem";
import SearchBar from "../item-form-fields/SearchBar";
import CategorySelector from "../item-form-fields/CategorySelector";
import ClosetItemsList from "../ClosetItemsList";
import useIsMobile from "@/src/hooks/useIsMobile";

export default function ClosetLeftPanel({
  selectedItem,
  setSelectedItem,
  userCloset,
  isLoading,
}: {
  selectedItem: ClosetItem | null;
  setSelectedItem: (item: ClosetItem) => void;
  userCloset: ClosetItem[];
  isLoading: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    ClosetItemCategory | "All"
  >("All");
  const isMobile = useIsMobile();

  // Filter items by category and search
  const filteredCloset = userCloset.filter((item) => {
    const itemCategory = item.category?.trim();
    const matchesCategory =
      selectedCategory === "All" || itemCategory === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`${
        isMobile ? "w-full" : "w-1/2 mr-4"
      } p-4 h-full overflow-y-auto bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-lg font-semibold mb-4">My Closet</h2>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <CategorySelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        userCloset={userCloset}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <ClosetItemsList
          filteredCloset={filteredCloset}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}
