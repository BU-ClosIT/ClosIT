import { db, aiModel } from "../model/firebaseConfig";
import ClosetItem from "@/model/closet/ClosetItem";
import IFirebaseServices from "@/model/firebase-services/FirebaseServices";
import { app } from "../model/firebaseConfig";

import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export class FirebaseServices implements IFirebaseServices {
  private static baseUrl: string =
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || "";

  public async getUserCloset(userId: string): Promise<ClosetItem[]> {
    const itemsCollectionRef = collection(db, "users", userId, "items");
    const q = query(itemsCollectionRef); // You can add orderBy, where clauses here
    const querySnapshot = await getDocs(q);
    const items: ClosetItem[] = [];

    querySnapshot.forEach((docSnap) => {

      items.push({
        id: docSnap.id, // Use the document's ID as the item's ID
        ...(docSnap.data() as Omit<ClosetItem, 'id'>),
      });

    });
    return items;
  }

  public async addItemToCloset(userId: string, item: any): Promise<void>{

    const itemsCollectionRef = collection(db, "users", userId, "items");
    const docRef = await addDoc(itemsCollectionRef, item); // addDoc auto-generates an ID

    console.log("Item added with ID: ", docRef.id);
  }

  public async removeItemFromCloset(
    userId: string,
    itemId: string
  ): Promise<void> {
    const itemDocRef = doc(db, "users", userId, "items", itemId);
    await deleteDoc(itemDocRef);
    console.log(`Item ${itemId} deleted successfully for user ${userId}`);
  }

  public async updateItemInCloset(
    userId: string,
    itemId: string,
    updatedItem: Partial<ClosetItem>
  ): Promise<void> {
    const itemDocRef = doc(db, "users", userId, "items", itemId);
    await updateDoc(itemDocRef, updatedItem);
    console.log(`Item ${itemId} updated successfully for user ${userId}`);
  }

  public async aiAgentQuery(prompt: string): Promise<string> {
    try {
      const result = await aiModel.generateContent(prompt);
      const responseText = result.response.text();
      return responseText;
    } catch (error) {
      console.error("Error querying Gemini AI");
      throw new Error ("Failed to get resopnse from AI agent");
    }
  }

  public async getRecommendation({
    userId,
    location,
    event,
  }: {
    userId: string;
    location?: string;
    event?: string;
  }): Promise<string> {

    let queryString: string = `Can you generate a few clothing ideas from my closet?
    Please consider fashionable color and style combinations that match the current season and forecast
    and return a response as list of items in a parseable JSON format.\n`;

    if (location != null) {
      // TODO: Get weather API response from location and add here
      queryString += "The weather today will be <weather>\n"
    }

    if (event != null) {
      queryString += `I will be dressing for ${event}\n`
    }

    const closetItems = await this.getUserCloset(userId);
    const closetSummary = JSON.stringify(
    closetItems.map(item => ({
      name: item.name,
      category: item.category,
      color: item.color,
      size: item.size,
      notes: item.notes
    })),
    null,
    2
  );

    queryString += `\nHere is my closet data in JSON format:\n${closetSummary}\n`

    

    return this.aiAgentQuery(queryString);
  }
}
