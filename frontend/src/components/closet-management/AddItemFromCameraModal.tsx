import { useCamera } from "@/src/hooks/useCamera";
import CloseButton from "../shared/CloseButton";
import { RefObject, useEffect } from "react";
import Loader from "../shared/Loader";

export default function AddItemFromCameraModal({
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
  if (!isOpen) return null;

  const { videoRef, start, stop, capture, cameraOn } = useCamera();

  // Auto-start camera on mount
  useEffect(() => {
    if (cameraOn) return;

    start();
  }, [cameraOn, start]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-7x1">
        <div className="flex flex-row items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">Add Item from Camera</h2>
          <CloseButton
            onClick={() => {
              stop();
              onClose();
            }}
          />
        </div>
        {isUploading ? (
          <Loader>Uploading...</Loader>
        ) : (
          <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-full h-full object-cover" />

            <button
              className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                const f = capture();
                stop();
                if (f) {
                  uploadFile(f);
                }
                onClose();
              }}
            >
              Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
