import ClosetItem from "../model/closet/ClosetItem";
import JsonBlob from "../model/JsonBlon";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  FirebaseStorage,
  uploadBytes,
} from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";
import firebase from "firebase/compat/app";

export const configProvider = () => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };
};

export class FirebaseServices {
  public static async getCurrentWeather() {
    try {
      const url = "/api/getCurrentWeather";
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
  }): Promise<{ content: string; outfit: ClosetItem[] }> {
    try {
      const url = "/api/getRecommendation";
      const resp = await fetch(url, {
        method: "POST",
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

  public static async updateItemInCloset({
    userId,
    itemId,
    updatedFields,
  }: {
    userId: string;
    itemId: string;
    updatedFields: any;
  }) {
    try {
      const url = "/api/updateItemInCloset";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemId,
          updatedFields,
        }),
      });

      const text = await resp.text();
      return text;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public static async uploadFileAndCreateItem({
    userId,
    file,
  }: {
    userId: string;
    file: File;
  }) {
    const app = firebase.initializeApp(configProvider());
    const storage: FirebaseStorage = getStorage(app);

    const fileName = `${Date.now()}_${file.name}`;
    // Create a storage ref
    const fileRef = storageRef(storage, `closetItems/${userId}/${fileName}`);

    // Upload the file
    const uploadTask = await uploadBytesResumable(fileRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log("File available at", downloadURL);
    const firestore: Firestore = getFirestore(app);
    const uid = userId;
    const col = collection(firestore, `closetItems/${uid}/closet`);

    const doc = await addDoc(col, {
      imageUrl: downloadURL,
      fileName,
      createdBy: uid,
      createdAt: serverTimestamp(),
    });

    // Call addFromPhoto API to get item details
    const url = "/api/addFromPhoto";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imgUrl: downloadURL,
        userId,
        imgId: doc.id,
        imgFileName: fileName,
      }),
    });

    const newItem = await resp.json();

    return newItem;
  }

  public static async uploadImageToStorage(
    storage: FirebaseStorage,
    file: File,
    path = "uploads"
  ) {
    const r = storageRef(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(r, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, path: snapshot.ref.fullPath };
  }

  public static uploadImageWithProgress(
    storage: FirebaseStorage,
    file: File,
    path = "uploads"
  ) {
    const r = storageRef(storage, `${path}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(r, file);
    return {
      task,
      on: (cb: (progress: { loaded: number; total: number }) => void) => {
        task.on("state_changed", (snapshot) => {
          cb({ loaded: snapshot.bytesTransferred, total: snapshot.totalBytes });
        });
      },
      then: async () => {
        await task;
        const url = await getDownloadURL(r);
        return { url, path: r.fullPath };
      },
    };
  }
  public static async deleteClosetItemById({
    userId,
    itemId,
  }: {
    userId: string;
    itemId: string;
  }) {
    try {
      const url = "/api/deleteClosetItemById";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemId,
        }),
      });

      const text = await resp.text();
      return text;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
