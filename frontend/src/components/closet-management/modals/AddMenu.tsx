export default function AddMenu({
  isOpen,
  onClose,
  setAddItemModalOpen,
  setAddItemFromCameraModalOpen,
  setAddItemFromGalleryModalOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  setAddItemModalOpen: (open: boolean) => void;
  setAddItemFromCameraModalOpen: (open: boolean) => void;
  setAddItemFromGalleryModalOpen: (open: boolean) => void;
}) {
  return (
    <div
      className={`bg-gray-200 border border-gray-300 rounded shadow-lg p-4 fixed bottom-30 right-4 z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ul>
        <li
          className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setAddItemModalOpen(true);
            onClose();
          }}
        >
          Add Item
        </li>
        <li
          className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setAddItemFromCameraModalOpen(true);
            onClose();
          }}
        >
          Import from Camera
        </li>
        <li
          className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setAddItemFromGalleryModalOpen(true);
            onClose();
          }}
        >
          Import from Gallery
        </li>
      </ul>
    </div>
  );
}
