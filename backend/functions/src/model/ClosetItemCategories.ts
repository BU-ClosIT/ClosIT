export const categories = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Legwear",
  "Footwear",
  "Accessories",
  "Bags",
  "Misc",
] as const;

export type ClosetItemCategory = (typeof categories)[number];
