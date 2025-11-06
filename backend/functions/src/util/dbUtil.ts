import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import ClosetItem from "../model/ClosetItem";
import JsonBlob from "../model/JsonBlob";
// a bunch of utils for interacting with the database
type SupportedTokenName =
  | "gemini-api-key"
  | "accuweather-api-key"
  | "visual-crossing-api-key";

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

  const newItem = dbRef.child(`${userId}`).child("item").push(closetItem);
  newItem.child("id").set(newItem.key);
  return newItem.key;
};

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
    const itemJson = itemsJson[key];
    const closetItem = ClosetItem.buildClosetItemFromJson(itemJson);
    closetItems.push(closetItem);
  });

  return closetItems;
};
