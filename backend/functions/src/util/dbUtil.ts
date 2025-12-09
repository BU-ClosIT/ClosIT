import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ClosetItem } from "../model/ClosetItem";
import { Outfit } from "../model/Outfit";
import JsonBlob from "../model/JsonBlob";

// a bunch of utils for interacting with the database
type SupportedTokenName =
  | "gemini-api-key"
  | "visual-crossing-api-key"
  | "closit-web-app-token";

/** Get a secure key from the DB by passing the name of the token */
export const tokenByName = async ({
  name,
  app,
}: {
  name: SupportedTokenName;
  app: admin.app.App;
}): Promise<string> => {
  functions.logger.log(`running token by name with name: ${name}`);
  const db = app.database();
  const dbRef = db.ref("tokens");
  const snap = await dbRef.child(`${name}`).get();
  if (!snap.exists()) {
    functions.logger.error("no data found at path:", `/${name}`);
    return "";
  }

  return snap.val() as string;
};

/** sets a closet item of the user in the database */
export const setClosetItem = async ({
  userId,
  closetItem,
  app,
}: {
  userId: string;
  closetItem: ClosetItem;
  app: admin.app.App;
}) => {
  functions.logger.log("running setClosetItem");
  const db = app.database();
  const dbRef = db.ref("closets");
  const userClosetSnap = await dbRef.child(`${userId}`).get();
  if (!userClosetSnap.exists()) {
    dbRef.push(`${userId}`);
  }

  const newItem = dbRef
    .child(`${userId}`)
    .child("closet")
    .push({ ...closetItem, createdAt: Date.now(), modifiedAt: Date.now() });
  newItem.child("id").set(newItem.key);
  return newItem.key;
};

/** gets the closet items by user id from database */
export const getClosetByUserId = async ({
  userId,
  app,
}: {
  userId: string;
  app: admin.app.App;
}): Promise<ClosetItem[]> => {
  functions.logger.log(`running getClosetByUserId for userId: ${userId}`);
  const db = app.database();
  const dbRef = db.ref("closets");
  const userClosetSnap = await dbRef.child(`${userId}/closet`).get();
  if (!userClosetSnap.exists()) {
    functions.logger.log(`no closet found for userId: ${userId}`);
    return [];
  }

  const itemsJson: JsonBlob = userClosetSnap.val() as JsonBlob;
  const closetItems: ClosetItem[] = [];
  Object.keys(itemsJson).forEach((key) => {
    const itemJson = itemsJson[key] as ClosetItem;
    closetItems.push(itemJson);
  });

  return closetItems;
};

export const storeOrUpdateUserConversation = async ({
  context,
  userId,
  app,
}: {
  context: JsonBlob;
  userId: string;
  app: admin.app.App;
}) => {
  functions.logger.log(
    `running storeOrUpdateUserConversation for userId: ${userId}`
  );

  const now = new Date();
  const dateString = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const db = app.database();
  const dbRef = db.ref(`closets/${userId}/conversations/${dateString}`);
  const userConvSnap = await dbRef.get();

  if (!userConvSnap.exists()) {
    dbRef.push({ ...context, createdAt: Date.now(), modifiedAt: Date.now() });
    return;
  }

  const newConv = dbRef.push({
    ...context,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  });
  newConv.child("id").set(newConv.key);
  return newConv.key;
};

export const setOutfitItem = async ({
  userId,
  outfit,
  app,
}: {
  userId: string;
  outfit: Outfit;
  app: admin.app.App;
}) => {
  functions.logger.log("running setOutfitItem");
  const db = app.database();
  const dbRef = db.ref(`closets/${userId}/outfits`);

  const newItem = dbRef.push({
    ...outfit,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  });
  newItem.child("id").set(newItem.key);
  return newItem.key;
};

export const getOutfitsByUserId = async ({
  userId,
  app,
}: {
  userId: string;
  app: admin.app.App;
}): Promise<Outfit[]> => {
  functions.logger.log(`running getOutfitsByUserId for userId: ${userId}`);
  const db = app.database();
  const dbRef = db.ref(`closets/${userId}/outfits`);
  const userOutfitsSnap = await dbRef.get();
  if (!userOutfitsSnap.exists()) {
    functions.logger.log(`no outfits found for userId: ${userId}`);
    return [];
  }

  const itemsJson: JsonBlob = userOutfitsSnap.val() as JsonBlob;
  const outfits: Outfit[] = [];
  Object.keys(itemsJson).forEach((key) => {
    const itemJson = itemsJson[key] as Outfit;
    outfits.push(itemJson);
  });

  return outfits;
};
