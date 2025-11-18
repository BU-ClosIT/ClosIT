import { ClosetItemCategory } from "./ClosetItemCategories";

/** Closet Item */
export type ClosetItem = {
  id: string;
  name: string;
  category: ClosetItemCategory;
  subCategory?: string; // new!
  color: string;
  material?: string; // new!
  size: string;
  brand?: string;
  purchaseDate?: string;
  imageUrl?: string;
  notes?: string;
  imgId?: string;
  imgFileName?: string;
  createdAt?: number;
  modifiedAt?: number;
};
