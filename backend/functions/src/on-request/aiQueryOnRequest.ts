import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { tokenByName } from "../util/dbUtil";
import { Response } from "express";

const aiQueryOnRequest = ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  //   const { body } = request;/
  //   const query = body.query; // The user's query

  //   // call Gemini endpoint
  //   const key = tokenByName("gemini-api-key", app);

  response.send("AI response placeholder");
};

export default aiQueryOnRequest;
