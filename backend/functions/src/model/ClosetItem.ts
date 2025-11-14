import { ClosetItemCategory } from "./ClosetItemCategories";

/** Closet Item */
export type ClosetItem = {
  id: string;
  name: string;
  category: ClosetItemCategory;
  color?: string;
  size?: string;
  brand?: string;
  purchaseDate?: string;
  imageUrl?: string;
  notes?: string;
};
