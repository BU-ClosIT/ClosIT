import ClosetItem from "../closet/ClosetItem";

export default interface IFirebaseServices {
  // closet interactions
  getUserCloset(userId: string): Promise<ClosetItem[]>;
  addItemToCloset(userId: string, item: any): Promise<void>;
  removeItemFromCloset(userId: string, itemId: string): Promise<void>;
  updateItemInCloset(
    userId: string,
    itemId: string,
    updatedItem: any
  ): Promise<void>;
  getItemById(userId: string, itemId: string): Promise<ClosetItem>;

  // AI interactions
  aiAgentQuery(prompt: string): Promise<string>;
  getRecommendation({
    userId,
    location,
  }: {
    userId: string;
    location?: string;
  }): Promise<string>;
}
