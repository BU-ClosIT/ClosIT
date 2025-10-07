import ClosetItem from "../closet/ClosetItem";

export default interface IFirebaseServices {
  // closet interactions
  getUserCloset(userId: string): Promise<ClosetItem[]>;
  addItemToCloset(userId: string, item: any): Promise<void>;
  removeItemFromCloset(userId: string, itemId: string): Promise<void>;
  updateItemInCloset(
    userId: string,
    itemId: string,
    updatedItem: Partial<ClosetItem>
  ): Promise<void>;

  // AI interactions
  aiAgentQuery(prompt: string): Promise<string>;
  getRecommendation({
    userId,
    location,
    event
  }: {
    userId: string;
    location?: string;
    event?: string;
  }): Promise<string>;
}
