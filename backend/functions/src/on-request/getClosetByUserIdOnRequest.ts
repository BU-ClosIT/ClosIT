import { Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { isOriginAllowed } from "../util/originUtil";

const getClosetByUserIdOnRequest = ({
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

  if (!origin || !isOriginAllowed(origin)) {
    response.status(400).send("Unauthorized");
    return;
  }
};

export default getClosetByUserIdOnRequest;
