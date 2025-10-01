import ClosetItem from "@/model/closet/ClosetItem";
import IFirebaseServices from "@/model/firebase-services/FirebaseServices";

export class FirebaseServices implements IFirebaseServices {
  private static baseUrl: string =
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || "";

  public static async getUserCloset(userId: string): Promise<ClosetItem[]> {}

  public static async addItemToCloset(
    userId: string,
    item: any
  ): Promise<void> {}

  public static async removeItemFromCloset(
    userId: string,
    itemId: string
  ): Promise<void> {}

  public static async updateItemInCloset(
    userId: string,
    itemId: string,
    updatedItem: any
  ): Promise<void> {}

  public static async getItemById(
    userId: string,
    itemId: string
  ): Promise<ClosetItem> {}

  public static async aiAgentQuery(prompt: string): Promise<string> {}
  public static async getRecommendation({
    userId,
    location,
  }: {
    userId: string;
    location?: string;
  }): Promise<string> {}
}
