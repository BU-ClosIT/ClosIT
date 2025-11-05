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
      return respJson;
    } catch (e) {
      console.error("Error fetching current weather");
      return "Error Fetching current weather";
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
      return "Error Fetching Outfit Rec";
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
  }): Promise<string> {
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

      return text;
    } catch (e) {
      console.error(e);
      return "Error Fetching Outfit Rec";
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
      return "Error Fetching User Closet";
    }
  }
}
