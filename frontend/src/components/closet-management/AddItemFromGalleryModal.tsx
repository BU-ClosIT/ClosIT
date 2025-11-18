import { RefObject } from "react";
import CloseButton from "../shared/CloseButton";

export default function AddItemFromGalleryModal({
  isOpen,
  onClose,
  uploadFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  uploadFile: (file: File) => Promise<void>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Add Item from Gallery</h2>
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}
