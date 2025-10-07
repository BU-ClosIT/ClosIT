// import ClosetItem from "@/model/closet/ClosetItem";
// import IFirebaseServices from "@/model/firebase-services/FirebaseServices";

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
    if (typeof window === "undefined") return "unavailable";
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
  }: {
    userId?: string;
  }): Promise<string> {
    if (typeof window === "undefined") return "unavailable";
    try {
      const url = "/api/getRecommendation";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreferences: "none",
          userId,
        }),
      });

      const text = await resp.text();

      return text;
    } catch (e) {
      console.error(e);
      return "Error Fetching Outfit Rec";
    }
  }
}
