"use client";

import { FormEvent, useEffect, useState } from "react";
import CloseButton from "../../shared/CloseButton";
import Outfit from "../../../model/Outfit";

export default function AddOutfitModal({
  isOpen,
  onClose,
  saveOutfit,
  defaultItemIds = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  saveOutfit: (o: Outfit) => Promise<void>;
  defaultItemIds: string[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    itemIds: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        itemIds: defaultItemIds,
      }));
    }
  }, [isOpen, defaultItemIds]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await saveOutfit({
      id: "",
      name: formData.name,
      desc: formData.desc,
      itemIds: formData.itemIds,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Save Outfit</h2>
          <CloseButton onClick={onClose} />
        </div>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Outfit Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description (optional)"
            className="border p-2 rounded"
            value={formData.desc}
            onChange={(e) =>
              setFormData({ ...formData, desc: e.target.value })
            }
          />

          <div className="border p-2 rounded bg-gray-100 text-sm">
            <strong>Items in Outfit:</strong>
            <ul className="text-xs mt-1">
              {formData.itemIds.map((id) => (
                <li key={id}>• {id}</li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save Outfit
          </button>
        </form>
      </div>
    </div>
  );
}
