import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";

export const deleteClosetItemOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const authorization = request.headers["authorization"];
  if (!authorization || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { userId, itemId } = request.body;

    const db = app.database();
    const itemRef = db.ref(`closets/${userId}/closet/${itemId}`);
    // check that the item is actually owned by the user asking to delete it
    if (!itemRef) {
      response.status(404).send("Item not found");
      return;
    }

    await itemRef.remove();
    response.status(200).send(`Item deleted successfully: ${itemId}`);
  } catch (error) {
    functions.logger.error("Error deleting closet item", error);
    response.status(500).send(`Error deleting closet item: ${error}`);
    return;
  }

  response.send("Not implemented yet");
};
