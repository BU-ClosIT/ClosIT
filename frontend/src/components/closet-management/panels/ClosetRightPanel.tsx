import { useEffect } from "react";
import ClosetItem from "../../../model/closet/ClosetItem";
import { useSearchParams } from "next/navigation";
import ItemDetails from "../item-form-fields/ItemDetails";
import { User } from "@/src/model/User";

export default function ClosetRightPanel({
  selectedItem,
  setSelectedItem,
  userCloset,
  setUserCloset,
  user,
}: {
  selectedItem: ClosetItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ClosetItem | null>>;
  userCloset: ClosetItem[];
  setUserCloset: React.Dispatch<React.SetStateAction<ClosetItem[]>>;
  user: User;
}) {
  // When URL param or selection changes:
  const searchParams = useSearchParams();
  useEffect(() => {
    const itemIdFromUrl = searchParams.get("id");
    if (!itemIdFromUrl || userCloset.length === 0) return;

    const item = userCloset.find((i) => i.id === itemIdFromUrl);
    if (item) {
      setSelectedItem(item);
    }
  }, [userCloset, searchParams, setSelectedItem]);

  return (
    <div className="w-1/2 h-full p-4 overflow-y-auto bg-white shadow-md rounded-lg">
      {selectedItem ? (
        <ItemDetails
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          userCloset={userCloset}
          setUserCloset={setUserCloset}
          user={user}
        />
      ) : (
        <div style={{ fontStyle: "italic", color: "#888" }}>
          Select an item to view details
        </div>
      )}
    </div>
  );
}
