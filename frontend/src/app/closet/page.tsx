"use client";

import React, { useEffect, useState } from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import PageLayout from "../../components/shared/PageLayout";
import { FirebaseServices } from "../../services/firebase-services";
import { useUser, useUserReady } from "../../components/providers/UserProvider";
import AddButton from "../../components/closet-management/item-form-fields/AddButton";
import AddMenu from "../../components/closet-management/modals/AddMenu";
import AddItemModal from "../../components/closet-management/modals/AddItemModal";
import AddItemFromCameraModal from "../../components/closet-management/modals/AddItemFromCameraModal";
import AddItemFromGalleryModal from "../../components/closet-management/modals/AddItemFromGalleryModal";
import ClosetLeftPanel from "../../components/closet-management/panels/ClosetLeftPanel";
import ClosetRightPanel from "../../components/closet-management/panels/ClosetRightPanel";
import useIsMobile from "@/src/hooks/useIsMobile";
import CloseButton from "@/src/components/shared/CloseButton";

export default function ClosetPage() {
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
  const [isAddItemFromCameraModalOpen, setAddItemFromCameraModalOpen] =
    useState<boolean>(false);
  const [isAddItemFromGalleryModalOpen, setAddItemFromGalleryModalOpen] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userCloset, setUserCloset] = useState<ClosetItem[]>([]);

  const isMobile = useIsMobile();

  const user = useUser();
  const isReady = useUserReady();

  useEffect(() => {
    if (!isReady || !user?.id) return;

    const fetchCloset = async () => {
      setIsLoading(true);
      try {
        const response: { items: ClosetItem[] } | ClosetItem[] =
          await FirebaseServices.getClosetByUserId({ userId: user.id });

        if (Array.isArray(response)) {
          setUserCloset(response);
        } else if ("items" in response && Array.isArray(response.items)) {
          setUserCloset(response.items);
        } else {
          console.warn("Unexpected closet response:", response);
          setUserCloset([]);
        }
      } catch (error) {
        console.error("Error fetching closet:", error);
        setUserCloset([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCloset();
  }, [isReady, user?.id]);

  const handleUpload = async (file: File) => {
    if (!user || isUploading) return;
    setIsUploading(true);
    try {
      const newItem = await FirebaseServices.uploadFileAndCreateItem({
        userId: user.id,
        file,
      });
      setUserCloset((prev) => [...prev, newItem]);
      setIsUploading(false);
      return newItem;
    } catch (e) {
      console.error("Error uploading file and creating item:", e);
      setIsUploading(false);
      return;
    }
  };

  return (
    <PageLayout currentPage="Closet">
      {!user ? (
        <div>Please log in to view your closet.</div>
      ) : (
        <div className="flex mt-5 mb-10 justify-center">
          <ClosetLeftPanel
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            userCloset={userCloset}
            isLoading={isLoading}
          />

          {!isMobile && (
            <ClosetRightPanel
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              userCloset={userCloset}
              setUserCloset={setUserCloset}
              user={user}
            />
          )}

          {isMobile && (
            <>
              {/* Backdrop: click to close */}
              <div
                className={`fixed inset-0 z-40 transition-opacity duration-200 ${
                  selectedItem
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={!selectedItem}
                onClick={() => setSelectedItem(null)}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Sliding panel from right */}
              <div
                className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-md bg-white shadow-md rounded-l-lg transform transition-transform duration-300 ${
                  selectedItem ? "translate-x-0" : "translate-x-full"
                }`}
                aria-hidden={!selectedItem}
              >
                <div className="p-4 h-full overflow-y-auto">
                  <div className="flex justify-end mb-2">
                    <CloseButton
                      onClick={() => {
                        setSelectedItem(null);
                      }}
                      aria-label="Close panel"
                    />
                  </div>

                  <ClosetRightPanel
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    userCloset={userCloset}
                    setUserCloset={setUserCloset}
                    user={user}
                  />
                </div>
              </div>
            </>
          )}

          <AddButton
            onClick={() => {
              setIsAddMenuOpen((prev) => !prev);
            }}
          />
        </div>
      )}

      {/* MODALS */}
      <AddMenu
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        setAddItemModalOpen={setAddItemModalOpen}
        setAddItemFromCameraModalOpen={setAddItemFromCameraModalOpen}
        setAddItemFromGalleryModalOpen={setAddItemFromGalleryModalOpen}
      />
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        addItem={async (item: ClosetItem) => {
          if (!user) return;
          const newItemId = await FirebaseServices.setItemInCloset({
            userId: user.id,
            item,
          });

          const newItemWithId = { ...item, id: newItemId };
          setUserCloset((prev) => [...prev, newItemWithId]);
        }}
      />
      <AddItemFromCameraModal
        isOpen={isAddItemFromCameraModalOpen}
        onClose={() => setAddItemFromCameraModalOpen(false)}
        uploadFile={handleUpload}
        isUploading={isUploading}
      />
      <AddItemFromGalleryModal
        isOpen={isAddItemFromGalleryModalOpen}
        onClose={() => setAddItemFromGalleryModalOpen(false)}
        uploadFile={handleUpload}
        isUploading={isUploading}
      />
    </PageLayout>
  );
}
