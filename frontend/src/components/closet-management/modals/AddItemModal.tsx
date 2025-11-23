import { FormEvent, useState } from "react";
import CloseButton from "../../shared/CloseButton";
import ClosetItem from "../../../model/closet/ClosetItem";
import ColorField from "../item-form-fields/ColorField";
import { categories } from "../../../model/closet/ClosetItemCategories";
import Size, { sizes } from "@/src/model/closet/Sizes";

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
    size: "" as Size,
    material: "",
    brand: "",
    purchaseDate: "",
    seasons: [],
    notes: "",
  });
  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addItem(formData);

    setFormData({
      id: "",
      name: "",
      category: "",
      subCategory: "",
      color: "",
      size: "" as Size,
      material: "",
      brand: "",
      purchaseDate: "",
      seasons: [],
      notes: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-140">
        <div className="flex flex-row items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">Add Item</h2>
          <CloseButton onClick={onClose} />
        </div>

        <form
          id="add-item-form"
          className="grid grid-cols-2 gap-6 mt-4"
          onSubmit={(e) => handleSubmit(e)}
          autoComplete="off"
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
            value={formData.category}
            required
            aria-placeholder="Select Category"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            id="item-size"
            className="border border-gray-300 p-2 rounded"
            value={formData.size}
            onChange={(e) =>
              setFormData({ ...formData, size: e.target.value as Size })
            }
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <input
            id="item-subcategory"
            type="text"
            placeholder="Subcategory (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
          />

          <input
            id="item-material"
            type="text"
            placeholder="Material (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.material}
            onChange={(e) =>
              setFormData({ ...formData, material: e.target.value })
            }
          />

          <input
            id="item-brand"
            type="text"
            placeholder="Brand (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
          />

          <input
            id="item-notes"
            type="text"
            placeholder="Notes (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          <div className="flex items-center space-x-2 ">
            <label htmlFor="item-color" className="text-gray-700"></label>
            <ColorField
              selectedItem={formData}
              handleFieldChange={(field, value) => {
                setFormData({ ...formData, [field]: value });
              }}
            />
          </div>

          <input
            id="item-purchaseDate"
            type="text"
            placeholder="Purchase Date (optional)"
            className="border border-gray-300 p-2 rounded"
            value={formData.purchaseDate}
            onChange={(e) =>
              setFormData({ ...formData, purchaseDate: e.target.value })
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
