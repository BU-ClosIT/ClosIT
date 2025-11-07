"use client"

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import ClosetItem from "@/src/model/closet/ClosetItem";
import { ClosetItemCard } from "@/src/components/closet-management/ClosetItemCard";
import PageLayout from "@/src/components/shared/PageLayout";

const categories = [
    "Outerwear",
    "Tops",
    "Bottoms",
    "Legwear",
    "Footwear",
    "Accessories",
    "Bags",
    "Misc",
];

export default function ClosetPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [sampleCloset, setCloset] = useState<ClosetItem[]>([
        { id: "1", name: "Winter Jacket", category: "Outerwear", color: "#3b82f6", size: "M" },
        { id: "2", name: "White Tee", category: "Tops", color: "#ffffff", size: "L" },
        { id: "3", name: "Sneakers", category: "Footwear", color: "#cccccc", size: "10", brand: "Nike" },
        { id: "4", name: "Wool Scarf", category: "Accessories", color: "#000000", size: "One Size" },
        { id: "5", name: "White Hoodie", category: "Outerwear", color: "#ecececff", size: "M", brand: "Levi's" },
        { id: "6", name: "Beanie", category: "Accessories", color: "#ff0000", size: "One Size" },
        { id: "7", name: "Denim Jacket", category: "Outerwear", color: "#8eb1e6ff", size: "M", brand: "Levi's" },
    ]);

    const handleSave = () => {
        if (!selectedItem) return;
        setCloset(prev =>
            prev.map(item => (item.id === selectedItem.id ? selectedItem : item))
        );
        setIsEditing(false);
    };

    const handleRevert = () => {
        if (!selectedItem) return;
        const original = sampleCloset.find(item => item.id === selectedItem.id);
        if (original) setSelectedItem(original);
    };

    // Count how many items per category
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] =
            sampleCloset.filter((item) => item.category?.trim() === category).length || 0;
        return acc;
    }, {} as Record<string, number>);

    // Filter items by category and search
    const filteredCloset = sampleCloset.filter((item) => {
        const itemCategory = item.category?.trim();
        const matchesCategory = selectedCategory === "All" || itemCategory === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleFieldChange = (field: keyof ClosetItem, value: string) => {
        if (!selectedItem) return;
        setSelectedItem({ ...selectedItem, [field]: value });
    };

    // Hex ↔ RGB helpers
    const hexToRgb = (hex: string) => {
        const cleaned = hex.replace("#", "").slice(0, 6);
        const r = parseInt(cleaned.slice(0, 2), 16);
        const g = parseInt(cleaned.slice(2, 4), 16);
        const b = parseInt(cleaned.slice(4, 6), 16);
        return { r, g, b };
    };

    const rgbToHex = (r: number, g: number, b: number) =>
        `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;

    const handleRgbChange = (r: number, g: number, b: number) => {
        handleFieldChange("color", rgbToHex(r, g, b));
    };

    return (
      <PageLayout>
        <div style={{ display: "flex", maxHeight: "93vh", maxWidth: "700px", padding: "20px", gap: "20px" }}>
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
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "15px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                >
                    <option value="All">All Categories ({sampleCloset.length})</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category} ({categoryCounts[category]})
                        </option>
                    ))}
                </select>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {filteredCloset.length > 0 ? (
                        filteredCloset.map((item) => (
                            <ClosetItemCard key={item.id} item={item} onClick={setSelectedItem} />
                        ))
                    ) : (
                        <div style={{ fontStyle: "italic", color: "#888" }}>
                            No {selectedCategory !== "All" ? selectedCategory : "items"} found
                        </div>
                    )}
                </div>
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
                        <h3>{selectedItem.name}</h3>
                        <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                            {isEditing ? "Save" : "Edit"}
                        </button>
                        {isEditing && (
                            <button onClick={handleRevert} style={{ marginLeft: "10px" }}>
                                Revert
                            </button>
                        )}

                        <p>
                            <strong>Category:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={selectedItem.category}
                                    onChange={(e) => handleFieldChange("category", e.target.value)}
                                />
                            ) : (
                                selectedItem.category
                            )}
                        </p>

                        <p>
                            <strong>Subcategory:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={selectedItem.subCategory || ""}
                                    onChange={(e) => handleFieldChange("subCategory", e.target.value)}
                                />
                            ) : (
                                selectedItem.subCategory || (
                                    <span style={{ fontStyle: "italic", color: "#888" }}>Unspecified</span>
                                )
                            )}
                        </p>

                        {/* Color Field */}
                        <p>
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
                                <div>
                                    <input
                                        type="text"
                                        value={selectedItem.color}
                                        onChange={(e) => handleFieldChange("color", e.target.value)}
                                    />
                                    <p></p>
                                    <HexColorPicker color={selectedItem.color} onChange={(c) => handleFieldChange("color", c)} />
                                    {/* RGB Inputs */}
                                    <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                                        {["r", "g", "b"].map((ch, i) => {
                                            const rgb = selectedItem.color? hexToRgb(selectedItem.color) : hexToRgb("000000");
                                            return (
                                                <input
                                                    key={ch}
                                                    type="number"
                                                    min={0}
                                                    max={255}
                                                    value={[rgb.r, rgb.g, rgb.b][i]}
                                                    onChange={(e) => {
                                                        const val = Math.max(0, Math.min(255, Number(e.target.value)));
                                                        if (ch === "r") handleRgbChange(val, rgb.g, rgb.b);
                                                        if (ch === "g") handleRgbChange(rgb.r, val, rgb.b);
                                                        if (ch === "b") handleRgbChange(rgb.r, rgb.g, val);
                                                    }}
                                                    style={{ width: "50px" }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {selectedItem.color}
                                </>
                            )}
                        </p>

                        <p>
                            <strong>Material:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={selectedItem.material || ""}
                                    onChange={(e) => handleFieldChange("material", e.target.value)}
                                />
                            ) : (
                                selectedItem.material || <span style={{ fontStyle: "italic", color: "#888" }}>Unspecified</span>
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
                                selectedItem.size
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
                                selectedItem.brand || <span style={{ fontStyle: "italic", color: "#888" }}>Unspecified</span>
                            )}
                        </p>

                        <p>
                            <strong>Purchase Date:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={selectedItem.purchaseDate || ""}
                                    onChange={(e) => handleFieldChange("purchaseDate", e.target.value)}
                                />
                            ) : (
                                selectedItem.purchaseDate || <span style={{ fontStyle: "italic", color: "#888" }}>Unspecified</span>
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
                                selectedItem.notes || <span style={{ fontStyle: "italic", color: "#888" }}>None</span>
                            )}
                        </p>

                        <p>
                            <strong>Image:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={selectedItem.imageUrl || ""}
                                    onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                                    placeholder="Enter image URL"
                                />
                            ) : selectedItem.imageUrl ? (
                                <img
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.name}
                                    style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
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
                        </p>
                    </div>
                ) : (
                    <div style={{ fontStyle: "italic", color: "#888" }}>Select an item to view details</div>
                )}
            </div>
        </div>
        </PageLayout>
    );
}