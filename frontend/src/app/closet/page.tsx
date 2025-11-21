"use client";

import React, { useEffect, useState } from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import { ClosetItemCard } from "../../components/closet-management/ClosetItemCard";
import PageLayout from "../../components/shared/PageLayout";
import { FirebaseServices } from "../../services/firebase-services";
import { useUser, useUserReady } from "../../components/providers/UserProvider";
import {
  categories,
  type ClosetItemCategory,
} from "../../model/closet/ClosetItemCategories";
import AddButton from "@/src/components/closet-management/AddButton";
import AddMenu from "@/src/components/closet-management/AddMenu";
import AddItemModal from "@/src/components/closet-management/AddItemModal";
import AddItemFromCameraModal from "@/src/components/closet-management/AddItemFromCameraModal";
import AddItemFromGalleryModal from "@/src/components/closet-management/AddItemFromGalleryModal";
import ColorField from "@/src/components/closet-management/ColorField";
import Loader from "@/src/components/shared/Loader";
import Image from "next/image";

export default function ClosetPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ClosetItemCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
  const [isAddItemFromCameraModalOpen, setAddItemFromCameraModalOpen] =
    useState<boolean>(false);
  const [isAddItemFromGalleryModalOpen, setAddItemFromGalleryModalOpen] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [userCloset, setUserCloset] = useState<ClosetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  const isReady = useUserReady();

  useEffect(() => {
    if (!isReady || !user?.id) return;

    const fetchCloset = async () => {
      setIsLoading(true);
      try {
        const response: { items: ClosetItem[] } | ClosetItem[] =
          await FirebaseServices.getClosetByUserId({ userId: user.id });

        console.log("Closet response:", response);

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

  const generateId = () =>
    `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  const handleAddNewItem = async () => {
    const newItem: ClosetItem = {
      id: generateId(),
      name: "New Item",
      category: "Outerwear",
      subCategory: "",
      color: "#ffffff",
      material: "",
      size: "",
      brand: "",
      purchaseDate: "",
      notes: "",
      imageUrl: "",
    };

    setUserCloset((prev) => [...prev, newItem]);
    setSelectedItem(newItem);
    setIsEditing(true);

    try {
      // Add to Firebase
      const result = await FirebaseServices.setItemInCloset({
        userId: user!.id,
        item: newItem,
      });

      console.log("Added new item to database:", result);
    } catch (error) {
      console.error("Failed to add item to database:", error);
      setUserCloset((prev) => prev.filter((item) => item.id !== newItem.id));
      setSelectedItem(null);
    }
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
      // Call your Firebase function
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

  const handleRevert = () => {
    if (!selectedItem) return;
    const original = userCloset.find((item) => item.id === selectedItem.id);
    if (original) setSelectedItem(original);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedItem.name}"?`
    );
    if (!confirmed) return;

    setUserCloset((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setSelectedItem(null);

    try {
      // Call Firebase function to delete from database
      await FirebaseServices.deleteClosetItemById({
        userId: user!.id,
        itemId: selectedItem.id,
      });
      console.log("Item deleted successfully from database");
    } catch (err) {
      console.error("Failed to delete item from database:", err);
      // Revert local deletion if it fails
      setUserCloset((prev) => [...prev, selectedItem]);
      setSelectedItem(selectedItem);
    }
  };

  // Count how many items per category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] =
      userCloset.filter((item) => item.category?.trim() === category).length ||
      0;
    return acc;
  }, {} as Record<string, number>);

  // Filter items by category and search
  const filteredCloset = userCloset.filter((item) => {
    const itemCategory = item.category?.trim();
    const matchesCategory =
      selectedCategory === "All" || itemCategory === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFieldChange = (field: keyof ClosetItem, value: string) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

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
      <div
        style={{
          display: "flex",
          maxHeight: "93vh",
          maxWidth: "700px",
          padding: "20px",
          gap: "20px",
          justifySelf: "center",
        }}
      >
        {/* Left Panel */}
        <div style={{ flex: "1", overflowY: "auto" }}>
          <h2>My Closet</h2>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              marginBottom: "10px",
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ClosetItemCategory | "All")
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="All">All Categories ({userCloset.length})</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category} ({categoryCounts[category]})
              </option>
            ))}
          </select>

          <button
            onClick={handleAddNewItem}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "10px",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>

          {selectedItem && (
            <button
              onClick={handleDelete}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete Item
            </button>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {filteredCloset.length > 0 ? (
                  filteredCloset.map((item) => (
                    <ClosetItemCard
                      key={item.id}
                      item={item}
                      onClick={setSelectedItem}
                      style={{
                        backgroundColor:
                          selectedItem?.id === item.id
                            ? "#d4dcffff"
                            : "#fdfdfd", // highlight selected
                      }}
                    />
                  ))
                ) : (
                  <div style={{ fontStyle: "italic", color: "#888" }}>
                    No {selectedCategory !== "All" ? selectedCategory : "items"}{" "}
                    found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: "1",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
            overflowY: "auto",
          }}
        >
          {selectedItem ? (
            <div>
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              {isEditing && (
                <button onClick={handleRevert} style={{ marginLeft: "10px" }}>
                  Revert
                </button>
              )}

              <p>
                <strong></strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                ) : (
                  selectedItem.name
                )}
              </p>

              {isEditing ? (
                <select
                  value={selectedItem.category}
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  style={{
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                selectedItem.category
              )}

              <p>
                <strong>Subcategory:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.subCategory || ""}
                    onChange={(e) =>
                      handleFieldChange("subCategory", e.target.value)
                    }
                  />
                ) : (
                  selectedItem.subCategory || (
                    <span style={{ fontStyle: "italic", color: "#888" }}>
                      Unspecified
                    </span>
                  )
                )}
              </p>

              {/* Color Field */}
              <div style={{ marginBottom: "10px" }}>
                <strong>Color:</strong>{" "}
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: selectedItem.color,
                      borderRadius: "4px",
                      boxShadow: "0 0 4px black",
                      marginRight: "5px",
                    }}
                  ></span>
                </>
                {isEditing ? (
                  <ColorField
                    selectedItem={selectedItem}
                    handleFieldChange={handleFieldChange}
                  />
                ) : (
                  selectedItem.color
                )}
              </div>

              <p>
                <strong>Material:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.material || ""}
                    onChange={(e) =>
                      handleFieldChange("material", e.target.value)
                    }
                  />
                ) : (
                  selectedItem.material || (
                    <span style={{ fontStyle: "italic", color: "#888" }}>
                      Unspecified
                    </span>
                  )
                )}
              </p>

              <p>
                <strong>Size:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.size}
                    onChange={(e) => handleFieldChange("size", e.target.value)}
                  />
                ) : (
                  selectedItem.subCategory || (
                    <span style={{ fontStyle: "italic", color: "#888" }}>
                      Unspecified
                    </span>
                  )
                )}
              </p>

              <p>
                <strong>Brand:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
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
              </p>

              <p>
                <strong>Purchase Date:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.purchaseDate || ""}
                    onChange={(e) =>
                      handleFieldChange("purchaseDate", e.target.value)
                    }
                  />
                ) : (
                  selectedItem.purchaseDate || (
                    <span style={{ fontStyle: "italic", color: "#888" }}>
                      Unspecified
                    </span>
                  )
                )}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {isEditing ? (
                  <textarea
                    value={selectedItem.notes || ""}
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                  />
                ) : (
                  selectedItem.notes || (
                    <span style={{ fontStyle: "italic", color: "#888" }}>
                      None
                    </span>
                  )
                )}
              </p>

              <div>
                <strong>Image:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedItem.imageUrl || ""}
                    onChange={(e) =>
                      handleFieldChange("imageUrl", e.target.value)
                    }
                    placeholder="Enter image URL"
                  />
                ) : selectedItem.imageUrl ? (
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    width={200}
                    height={200}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      color: "#888",
                      marginTop: "10px",
                    }}
                  >
                    [No image]
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ fontStyle: "italic", color: "#888" }}>
              Select an item to view details
            </div>
          )}
        </div>
      </div>
      <AddButton
        onClick={() => {
          setIsAddMenuOpen((prev) => !prev);
        }}
      />

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
          const newItem = await FirebaseServices.setItemInCloset({
            userId: user.id,
            item,
          });
          setUserCloset((prev) => [...prev, newItem]);
          return newItem;
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
