import { Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getClosetByUserId } from "../util/dbUtil";
import { isAuthorizedRequest } from "../util/tokenUtil";

const getClosetByUserIdOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  if (request.method !== "GET") {
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

    const closet = await getClosetByUserId({ userId, app });

    response.status(200).send(JSON.stringify({ items: closet }));
  } catch (e) {
    functions.logger.error("Error getting closet by user ID", e);
    response.status(500).send(`Error getting closet by user ID: ${e}`);
  }
};

export default getClosetByUserIdOnRequest;
