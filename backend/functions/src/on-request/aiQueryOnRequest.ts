import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { tokenByName } from "../util/dbUtil";
import { Response } from "express";
import { queryGemini } from "../services/gemini-services";
import { isAuthorizedRequest } from "../util/tokenUtil";

/** A Generic query to Gemini with query text
 *
 * Used mainly for testing and chatbot style interactions
 */
const aiQueryOnRequest = ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const { body } = request;
  const query = body.query; // The user's query

  const bearerToken = request.headers["authorization"]?.split("Bearer ")[1];
  if (!bearerToken || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const resp = queryGemini({ query, app });
    response.send("AI response placeholder: " + resp);
  } catch (e) {
    functions.logger.error("Error querying Gemini", e);
    response.status(500).send(`Error querying Gemini: ${e}`);
    return;
  }
};

export default aiQueryOnRequest;
