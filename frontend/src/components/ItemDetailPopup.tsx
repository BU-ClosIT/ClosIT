// src/components/ItemDetailPopup.tsx
import React from "react";
import ClosetItem from "@/model/closet/ClosetItem";

interface ItemDetailPopupProps {
  item: ClosetItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailPopup: React.FC<ItemDetailPopupProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "360px",
          maxWidth: "90vw",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2>{item.name}</h2>
        <p><strong>Category:</strong> {item.category}</p>
        {item.subCategory && <p><strong>Subcategory:</strong> {item.subCategory}</p>}
        <p><strong>Size:</strong> {item.size}</p>
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <strong>Color:</strong> {item.color}
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              backgroundColor: item.color,
              boxShadow: `0 0 4px ${"black"}`,
              borderRadius: "4px",
            }}
          ></span>
        </p>
        {item.brand && <p><strong>Brand:</strong> {item.brand}</p>}
        {item.material && <p><strong>Material:</strong> {item.material}</p>}
        {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}

        <button
          style={{
            marginTop: "16px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
