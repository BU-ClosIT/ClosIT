import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";

export const updateItemOnRequest = ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  if (request.method !== "POST") {
    response.status(401).send("Invalid");
    return;
  }

  const authorization = request.headers["authorization"];
  if (!authorization || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { userId, itemId, updatedFields } = request.body;

    const db = app.database();
    const itemRef = db.ref(`closets/${userId}/closet/${itemId}`);

    itemRef.update(updatedFields, (error) => {
      if (error) {
        functions.logger.error("Error updating item", error);
        response.status(500).send(`Error updating item: ${error}`);
      } else {
        response.status(200).send(`Item updated successfully: ${itemId}`);
      }
    });
  } catch (error) {
    functions.logger.error("Error updating item", error);
    response.status(500).send(`Error updating item: ${error}`);
  }
};
