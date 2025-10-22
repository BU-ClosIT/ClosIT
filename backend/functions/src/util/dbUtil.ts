import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import ClosetItem from "../model/ClosetItem";
// a bunch of utils for interacting with the database
type SupportedTokenName = "gemini-api-key" | "accuweather-api-key";

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
  functions.logger.log(`running setClosetItem`);
  const db = app.database();
  const dbRef = db.ref("closets");
  const userClosetSnap = await dbRef.child(`${userId}`).get();
  if (!userClosetSnap.exists()) {
    dbRef.push(`${userId}`);
  }

  const newItem = dbRef.child(`${userId}`).child("item").push(closetItem);
  return newItem.key;
};
