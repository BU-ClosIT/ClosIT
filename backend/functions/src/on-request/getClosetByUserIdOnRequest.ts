import { Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { isOriginAllowed } from "../util/originUtil";
import { getClosetByUserId } from "../util/dbUtil";

const getClosetByUserIdOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const origin = `${request.header("x-closit-referrer")}`;

  if (request.method !== "GET") {
    response.status(401).send("Invalid");
    return;
  }

  if (!origin || !isOriginAllowed(origin)) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { userId } = request.body;

    const closet = await getClosetByUserId({ userId, app });

    response.status(200).send(JSON.stringify({ items: closet }));
  } catch (e) {
    functions.logger.error("Error getting closet by user ID", e);
    response.status(500).send(`Error getting closet by user ID: ${e}`);
  }
};

export default getClosetByUserIdOnRequest;
