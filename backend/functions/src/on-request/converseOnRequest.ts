import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { getClosetByUserId } from "../util/dbUtil";
import { queryGemini } from "../services/gemini-services";

const converseOnRequest = async ({
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
    const { query, userId } = request.body;

    const userCloset = await getClosetByUserId({ userId, app });

    const aiResp = await queryGemini({
      query: `You are an AI assistant for picking outfits based on a user's clothing closet, weather, and context.

The user's closet contains the following items: ${JSON.stringify(userCloset)}.

Using the provided context, which is: ${query},
suggest an appropriate outfit from the user's closet 
or respond directly to the user's query if no outfit can be suggested.

Return the response as a JSON object with fields: {
  outfit: [array of ClosetItem IDs from the user's closet],
  explanation: string,
}

Ensure the response is strictly in JSON format with no additional text.`,
      app,
    });

    response.status(200).send(aiResp);
  } catch (error) {
    functions.logger.error("Error in converseOnRequest", error);
    response.status(500).send(`Error in converseOnRequest: ${error}`);
  }
};

export default converseOnRequest;
