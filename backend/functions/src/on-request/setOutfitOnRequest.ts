import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { setOutfitItem } from "../util/dbUtil";

/** Handles HTTP POST request for setting a new outfit */
const setOutfitOnRequest= async ({
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

    // set the item in the outfits database
    const itemId = await setOutfitItem({ userId, outfitItem: item, app });

    response.status(200).send({ itemId });
  } catch (error) {
    functions.logger.error("Error setting outfit in closet", error);
    response.status(500).send(`Error setting outfit in closet: ${error}`);
  }
};

export default setOutfitOnRequest;
