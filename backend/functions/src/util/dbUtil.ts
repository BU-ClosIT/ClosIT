import * as admin from "firebase-admin";

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
  const snap = app.database().ref(`tokens/${name}` + name);
  const key = await snap.get();

  if (!key.exists()) {
    throw new Error(`No API key found for token name: ${name}`);
  }

  return key.val() as string;
};
