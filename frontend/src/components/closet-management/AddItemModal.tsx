import { FormEvent, useState } from "react";
import CloseButton from "../shared/CloseButton";
import ClosetItem from "@/src/model/closet/ClosetItem";
import ColorField from "./ColorField";

export default function AddItemModal({
  isOpen,
  onClose,
  addItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  addItem: (item: ClosetItem) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ClosetItem>({
    id: "",
    name: "",
    category: "",
    subCategory: "",
    color: "",
    size: "",
    notes: "",
  });
  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addItem(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <div className="flex flex-row items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">Add Item</h2>
          <CloseButton onClick={onClose} />
        </div>
        <form
          id="add-item-form"
          className="flex flex-col space-y-4 mt-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            id="item-name"
            type="text"
            placeholder="Item Name"
            className="border border-gray-300 p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            id="item-category"
            className="border border-gray-300 p-2 rounded"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="shoes">Shoes</option>
          </select>
          <select
            id="item-subcategory"
            className="border border-gray-300 p-2 rounded"
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
          >
            <option value="">Select Sub-Category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="outerwear">Outerwear</option>
            <option value="footwear">Footwear</option>
            <option value="jewelry">Jewelry</option>
            <option value="bags">Bags</option>
          </select>
          <select
            id="item-size"
            className="border border-gray-300 p-2 rounded"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            <option value="">Select Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="x-large">X-Large</option>
            <option value="xx-large">XX-Large</option>
          </select>
          <div className="flex items-center space-x-2">
            <label htmlFor="item-color" className="text-gray-700">
              Color:
            </label>
            <ColorField
              selectedItem={formData}
              handleFieldChange={(field, value) => {
                setFormData({ ...formData, [field]: value });
              }}
            />
          </div>

          <input
            id="item-notes"
            type="text"
            placeholder="Note (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <button
            id="add-item-submit"
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
