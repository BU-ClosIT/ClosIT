import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { tokenByName } from "../util/dbUtil";

export const isAuthorizedRequest = async ({
  request,
  app,
}: {
  request: functions.https.Request;
  app: admin.app.App;
}): Promise<boolean> => {
  const token = request.headers["authorization"]?.split("Bearer ")[1];

  if (!token) {
    return false;
  }

  const tokenFromDb = await tokenByName({
    name: "closit-web-app-token",
    app,
  });

  return token === tokenFromDb;
};
