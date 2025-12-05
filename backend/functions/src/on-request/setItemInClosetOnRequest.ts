import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { setClosetItem } from "../util/dbUtil";

/** Handles HTTP POST request for setting a closet item */
const setItemInClosetOnRequest = async ({
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
    const { userId, item } = request.body;

    // set the item in the closet database
    const itemId = await setClosetItem({ userId, closetItem: item, app });

    response.status(200).send({ itemId });
  } catch (error) {
    functions.logger.error("Error setting item in closet", error);
    response.status(500).send(`Error setting item in closet: ${error}`);
  }
};

export default setItemInClosetOnRequest;
