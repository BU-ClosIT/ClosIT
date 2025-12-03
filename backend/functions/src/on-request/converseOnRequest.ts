import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import {
  getClosetByUserId,
  storeOrUpdateUserConversation,
} from "../util/dbUtil";
import { queryGemini } from "../services/gemini-services";
import JsonBlob from "../model/JsonBlob";

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
    const { context, currentWeather } = query;

    const userCloset = await getClosetByUserId({ userId, app });

    await storeOrUpdateUserConversation({
      context: context[context.length - 1], // store only the most recent message from the user
      userId,
      app,
    });

    const currentContext = `${
      JSON.stringify(context) || "unknown"
    }, and the current weather conditions: ${JSON.stringify(
      currentWeather || "unavailable"
    )},`;

    const aiResp = await queryGemini({
      query: `You are an AI assistant for picking outfits based on a user's clothing closet, weather, and context.

The user's closet contains the following items: ${JSON.stringify(userCloset)}.

Using the provided context, which is: ${currentContext}
suggest an appropriate outfit from the user's closet 
or respond directly to the user's query if no outfit can be suggested.

Return the response as a JSON object with fields: {
  outfit: [array of ClosetItem IDs from the user's closet],
  explanation: [string of why this outfit was chosen or the answer to the user's query],
}`,
      app,
    });

    const cleanText = aiResp
      ?.replace("```json", "")
      .replace("```", "")
      .replace("\\n", "");

    await storeOrUpdateUserConversation({
      context: JSON.parse(cleanText || "{}") as JsonBlob,
      userId,
      app,
    });

    response.status(200).send(cleanText);
  } catch (error) {
    functions.logger.error("Error in converseOnRequest", error);
    response.status(500).send(`Error in converseOnRequest: ${error}`);
  }
};

export default converseOnRequest;
