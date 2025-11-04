import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isOriginAllowed } from "../util/originUtil";
import ClosetItem from "../model/ClosetItem";
import { setClosetItem } from "../util/dbUtil";

const setItemInClosetOnRequest = ({
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

  try {
    const { userId, item } = request.body;
    const cleanItem = ClosetItem.buildClosetItemFromJson({ ...item, id: "" });

    const itemId = setClosetItem({ userId, closetItem: cleanItem, app });

    response.status(200).send(`Item set in closet: ${itemId}`);
  } catch (error) {
    functions.logger.error("Error setting item in closet", error);
    response.status(500).send(`Error setting item in closet: ${error}`);
  }
};

export default setItemInClosetOnRequest;
