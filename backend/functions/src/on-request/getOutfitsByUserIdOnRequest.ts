import { Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getOutfitsByUserId } from "../util/dbUtil";
import { isAuthorizedRequest } from "../util/tokenUtil";

const getOutfitsByUserIdOnRequest = async ({
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

  const bearerToken = request.headers["authorization"]?.split("Bearer ")[1];
  if (!bearerToken || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { userId } = request.body;

    const outfits = await getOutfitsByUserId({ userId, app });

    response.status(200).send(JSON.stringify({ items: outfits }));
  } catch (e) {
    functions.logger.error("Error getting outfit by user ID", e);
    response.status(500).send(`Error getting outfit by user ID: ${e}`);
  }
};

export default getOutfitsByUserIdOnRequest;
