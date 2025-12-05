import { FirebaseServices } from "../../../services/firebase-services";
import ClosetItem from "../../../model/closet/ClosetItem";
import { useState } from "react";
import { categories } from "@/src/model/closet/ClosetItemCategories";
import ColorField from "./ColorField";
import Image from "next/image";
import { User } from "@/src/model/User";
import EditButtons from "./EditButtons";
import SeasonsChips from "./SeasonsChips";
import { sizes } from "@/src/model/closet/Sizes";

export default function ItemDetails({
  selectedItem,
  setSelectedItem,
  userCloset,
  setUserCloset,
  user,
}: {
  selectedItem: ClosetItem;
  setSelectedItem: React.Dispatch<React.SetStateAction<ClosetItem | null>>;
  userCloset: ClosetItem[];
  setUserCloset: React.Dispatch<React.SetStateAction<ClosetItem[]>>;
  user: User;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleDelete = async () => {
    if (!selectedItem) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedItem.name}"? \n
        This action cannot be undone.`
    );
    if (!confirmed) return;

    setUserCloset((prev) => prev.filter((item) => item.id !== selectedItem.id));

    try {
      // Call Firebase function to delete from database
      await FirebaseServices.deleteClosetItemById({
        userId: user!.id,
        itemId: selectedItem.id,
      });
      console.log("Item deleted successfully from database");
      setSelectedItem(null);
    } catch (err) {
      console.error("Failed to delete item from database:", err);
      // Revert local deletion if it fails
      setUserCloset((prev) => [...prev, selectedItem]);
      setSelectedItem(selectedItem);
    }
  };

  const handleRevert = () => {
    if (!selectedItem) return;
    const original = userCloset.find((item) => item.id === selectedItem.id);
    if (original) setSelectedItem(original);
  };

  const handleFieldChange = (
    field: keyof ClosetItem,
    value: string | string[]
  ) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    const originalItem = userCloset.find((item) => item.id === selectedItem.id);
    if (!originalItem) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedFields: Record<string, any> = {};
    (Object.keys(selectedItem) as (keyof ClosetItem)[]).forEach((key) => {
      if (selectedItem[key] !== originalItem[key]) {
        updatedFields[key] = selectedItem[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    setUserCloset((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? selectedItem : item))
    );

    try {
      const response = await FirebaseServices.updateItemInCloset({
        userId: user!.id,
        itemId: selectedItem.id,
        updatedFields,
      });
      console.log("Updated item in database:", response);
    } catch (err) {
      console.error("Failed to update item in database:", err);
      // Optionally revert local state on failure
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <div>
      <EditButtons
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        handleRevert={handleRevert}
        handleDelete={handleDelete}
      />
      <div className="flex flex-col gap-3 mb-4">
        {isEditing ? (
          <input
            type="text"
            value={selectedItem.name}
            className="text-lg font-semibold"
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        ) : (
          <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
        )}

        {isEditing ? (
          <select
            value={selectedItem.category}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            className="p-2 w-full border border-gray-300 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-md border border-gray-300 p-2">
            {selectedItem.category}
          </p>
        )}

        <div>
          <label htmlFor="subCategory" className="font-semibold mr-2">
            Subcategory:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="subCategory"
              value={selectedItem.subCategory || ""}
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              onChange={(e) => handleFieldChange("subCategory", e.target.value)}
            />
          ) : (
            selectedItem.subCategory || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        {/* Color Field */}
        <div className="flex items-center">
          <label htmlFor="color" className="font-semibold mr-2">
            Color:
          </label>

          {isEditing ? (
            <ColorField
              selectedItem={selectedItem}
              handleFieldChange={handleFieldChange}
            />
          ) : (
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-md shadow-md mr-2 ml-2 border border-gray-500`}
                style={{
                  backgroundColor: selectedItem.color,
                }}
              ></div>
              <p>{selectedItem.color}</p>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <label htmlFor="material" className="font-semibold mr-2">
            Material:
          </label>
          {isEditing ? (
            <input
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              type="text"
              id="material"
              value={selectedItem.material || ""}
              onChange={(e) => handleFieldChange("material", e.target.value)}
            />
          ) : (
            selectedItem.material || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        {/* TODO handle shoe sizes */}
        <div className="flex items-center">
          <label htmlFor="size" className="font-semibold mr-2">
            Size:
          </label>
          {isEditing ? (
            <select
              id="size"
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              value={selectedItem.size}
              onChange={(e) => handleFieldChange("size", e.target.value)}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          ) : (
            selectedItem.size || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        <div className="flex items-center">
          <label htmlFor="brand" className="font-semibold mr-2">
            Brand:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="brand"
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              value={selectedItem.brand || ""}
              onChange={(e) => handleFieldChange("brand", e.target.value)}
            />
          ) : (
            selectedItem.brand || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        <div className="flex items-center">
          <label htmlFor="seasons" className="font-semibold mr-2">
            Seasons:
          </label>
          {isEditing ? (
            <SeasonsChips
              selectedItem={selectedItem}
              onChange={handleFieldChange}
            />
          ) : typeof selectedItem.seasons === "string" ? (
            selectedItem.seasons
          ) : (
            selectedItem.seasons?.join(", ") || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        <div className="flex items-center">
          <label htmlFor="purchaseDate" className="font-semibold mr-2">
            Purchase Date:
          </label>
          {isEditing ? (
            <input
              type="text"
              id="purchaseDate"
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              value={
                new Date(`${selectedItem.purchaseDate}`).toLocaleDateString() ||
                ""
              }
              onChange={(e) =>
                handleFieldChange("purchaseDate", e.target.value)
              }
            />
          ) : (
            new Date(`${selectedItem.purchaseDate}`).toLocaleDateString() || (
              <span style={{ fontStyle: "italic", color: "#888" }}>
                Unspecified
              </span>
            )
          )}
        </div>

        <div className="flex items-start">
          <label htmlFor="notes" className="font-semibold mr-2">
            Notes:
          </label>
          {isEditing ? (
            <textarea
              id="notes"
              className="mb-2 p-2 w-full border border-gray-300 rounded"
              value={selectedItem.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
            />
          ) : (
            selectedItem.notes || (
              <span style={{ fontStyle: "italic", color: "#888" }}>None</span>
            )
          )}
        </div>
      </div>

      <div>
        <label className="font-semibold" htmlFor="imageUrl">
          Image:
        </label>
        {isEditing ? (
          <input
            type="text"
            id="imageUrl"
            className="mb-2 p-2 w-full border border-gray-300 rounded"
            value={selectedItem.imageUrl || ""}
            onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
            placeholder="Enter image URL"
          />
        ) : selectedItem.imageUrl ? (
          <Image
            src={selectedItem.imageUrl}
            alt={selectedItem.name}
            width={200}
            height={200}
            unoptimized
            style={{
              width: "100%",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-lg mt-2 text-gray-500">
            [No image]
          </div>
        )}
      </div>
    </div>
  );
}
