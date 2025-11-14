import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { ClosetItem } from "../model/ClosetItem";
import { setClosetItem } from "../util/dbUtil";

const setItemInClosetOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const bearerToken = request.headers["authorization"]?.split("Bearer ")[1];
  if (!bearerToken || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { userId, item } = request.body;

    const itemId = await setClosetItem({ userId, closetItem: item, app });

    response.status(200).send(`Item set in closet: ${itemId}`);
  } catch (error) {
    functions.logger.error("Error setting item in closet", error);
    response.status(500).send(`Error setting item in closet: ${error}`);
  }
};

export default setItemInClosetOnRequest;
