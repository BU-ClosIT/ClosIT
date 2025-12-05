import JsonBlob from "./JsonBlob";

export default class Outfit {
    public id: string;
    public name?: string;
    public desc?: string;
    public itemIds?: string[];

  private constructor({
    id,
    name,
    desc,
    itemIds
  }: {
    id: string;
    name?: string;
    desc?: string;
    itemIds?: string[];
  }) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.itemIds = itemIds;
  }

  public static buildOutfitFromJson(json: JsonBlob): Outfit {
    if (
      !json ||
      !json.id
    ) {
      throw new Error("Invalid Outfit JSON object");
    }

    return new Outfit({
      id: json.id,
      name: json.name,
      desc: json.desc,
      itemIds: json.itemIds as string[],
    });
  }
}
