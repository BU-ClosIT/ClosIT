// import ClosetItem from "@/model/closet/ClosetItem";
// import IFirebaseServices from "@/model/firebase-services/FirebaseServices";

import JsonBlob from "../model/JsonBlon";

export class FirebaseServices {
  public static async getCurrentWeather() {
    try {
      const url = "/api/getCurrentWeather";
      const resp = await fetch(url, {
        method: "GET",
      });

      const respJson = await resp.json();
      console.log("Fetched current weather:", respJson);
      return respJson;
    } catch (e) {
      console.error("Error fetching current weather");
      return null;
    }
  }

  public static async aiAgentQuery({
    query,
  }: {
    query: string;
  }): Promise<string> {
    try {
      const url = "/api/aiQuery";
      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      const respJson = await resp.json();

      return respJson;
    } catch (e) {
      return "Error Fetching AI Response";
    }
  }

  public static async getRecommendation({
    userId,
    userPreferences,
    context,
  }: {
    userId?: string;
    userPreferences?: string;
    context?: JsonBlob;
  }): Promise<{ content: string; outfit: string[] }> {
    try {
      const url = "/api/getRecommendation";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreferences,
          userId,
          context,
        }),
      });

      const text = await resp.text();
      const cleanText = text.replace("```json", "").replace("```", "");

      return JSON.parse(cleanText);
    } catch (e) {
      console.error(e);
      return { content: "Error Fetching Outfit Rec", outfit: [] };
    }
  }

  public static async getClosetByUserId({ userId }: { userId: string }) {
    try {
      const url = "/api/getClosetByUserId";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const json = await resp.json();

      return json;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public static async setItemInCloset({
    userId,
    item,
  }: {
    userId: string;
    item: any;
  }) {
    try {
      const url = "/api/setItemInCloset";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          item,
        }),
      });

      const json = await resp.json();

      return json;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
