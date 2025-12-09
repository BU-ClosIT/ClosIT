import { useState } from "react";
import CloseButton from "../../shared/CloseButton";
import Loader from "../../shared/Loader";

export default function AddItemFromGalleryModal({
  isOpen,
  onClose,
  uploadFile,
  isUploading,
}: {
  isOpen: boolean;
  onClose: () => void;
  uploadFile: (file: File) => Promise<void>;
  isUploading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex flex-row items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">Add Item from Gallery</h2>
          <CloseButton onClick={onClose} />
        </div>

        {isUploading ? (
          <Loader>Uploading...</Loader>
        ) : (
          <div>
            <input
              className="image-input-field border border-gray-300 p-2 rounded"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
              }}
            />

            <button
              className="upload-btn mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={async () => {
                if (file) {
                  await uploadFile(file);
                  onClose();
                }
              }}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
