import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
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
