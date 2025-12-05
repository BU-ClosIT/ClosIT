import JsonBlob from "../JsonBlob";
import Season from "./Seasons";
import Size from "./Sizes";

export default class ClosetItem {
  public id: string;
  public name: string;
  public category: string;
  public subCategory?: string; // new!
  public color: string;
  public material?: string; // new!
  public size: Size;
  public brand?: string;
  public purchaseDate?: string;
  public imageUrl?: string;
  public notes?: string;
  public createdAt?: number;
  public modifiedAt?: number;
  public seasons?: Season[]; // new!

  private constructor({
    id,
    name,
    category,
    subCategory,
    color,
    material,
    size,
    brand,
    purchaseDate,
    imageUrl,
    notes,
    seasons,
  }: {
    id: string;
    name: string;
    category: string;
    subCategory?: string;
    color: string;
    material?: string;
    size: Size;
    brand?: string;
    purchaseDate?: string;
    imageUrl?: string;
    notes?: string;
    seasons?: Season[];
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.subCategory = subCategory;
    this.color = color;
    this.material = material;
    this.size = size;
    this.brand = brand;
    this.purchaseDate = purchaseDate;
    this.imageUrl = imageUrl;
    this.notes = notes;
    this.seasons = seasons;
  }

  public static buildClosetItemFromJson(json: JsonBlob): ClosetItem {
    if (
      !json ||
      !json.id ||
      !json.name ||
      !json.category ||
      !json.color ||
      !json.size
    ) {
      throw new Error("Invalid JSON object");
    }

    return new ClosetItem({
      id: json.id,
      name: json.name,
      category: json.category,
      subCategory: json.subCategory,
      color: json.color,
      material: json.material,
      size: json.size,
      brand: json.brand,
      purchaseDate: json.purchaseDate,
      imageUrl: json.imageUrl,
      notes: json.notes,
      seasons: json.seasons as Season[],
    });
  }
}
