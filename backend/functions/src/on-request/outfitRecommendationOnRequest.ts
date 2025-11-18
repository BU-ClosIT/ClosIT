import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { queryGemini } from "../services/gemini-services";
import { getGeoPositionFromIp, getIpFromReq } from "../services/geoip-services";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { getClosetByUserId } from "../util/dbUtil";
import { CurrentWeatherResponse } from "../model/VisualCrossing";
import { getCurrentWeatherByLatLong } from "../services/visualcrossing-services";

const outfitRecommendationOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  // get users closet information from the database using the userId in the query
  const authorization = request.headers["authorization"];
  if (!authorization || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  const clientIp = getIpFromReq({ request });
  if (!clientIp) {
    response.status(500).send("Could not determine client IP");
    return;
  }

  try {
    const { userId, context, userPreferences, selectedUnit } = request.body;

    functions.logger.log(
      `Outfit Recommendation requested for userId: ${userId} 
      with preferences: ${userPreferences} 
      and context: ${JSON.stringify(context)}`
    );

    if (!userId) {
      response.status(400).send("Missing userId in request body");
      return;
    }

    let currentWeather: CurrentWeatherResponse | null =
      context.currentWeather.weather;

    if (!currentWeather) {
      functions.logger.log(
        "Outfit Recommendation: Fetching current weather as none was provided"
      );
      const geoPosition = await getGeoPositionFromIp({ ip: clientIp });
      currentWeather = await getCurrentWeatherByLatLong({
        latLong: `${geoPosition.lat},${geoPosition.lon}`,
        selectedUnit: selectedUnit || "F",
        app,
      });
    }

    const userCloset = await getClosetByUserId({ userId, app });
    const resp = await queryGemini({
      query: JSON.stringify({
        prompt: `You are a helpful assistant for picking clothes, 
          please respond in the format: { content: "anything you want to say here", outfit: [itemId1, itemId2, ...] }`,
        currentWeather: currentWeather?.currentConditions || null,
        userPreferences,
        userCloset,
      }),
      app,
    });

    if (!resp) {
      response
        .status(500)
        .send("No response from outfit recommendation service");
      return;
    }

    const cleanText = resp
      .replace("```json", "")
      .replace("```", "")
      .replace("\\n", "");

    const { content, outfit } = JSON.parse(cleanText);

    // inject full closet items into the outfit response
    const injectedOutfit = outfit
      .map((itemId: string) =>
        userCloset.find((closetItem) => closetItem.id === itemId)
      )
      .filter((item: any) => item !== undefined);

    const returnable = JSON.stringify({ content, outfit: injectedOutfit });
    response.status(200).json(returnable);
  } catch (e) {
    functions.logger.error("Error fetching user closet data", e);
    response.status(500).send(`Error fetching user closet data: ${e}`);
    return;
  }
};

export default outfitRecommendationOnRequest;
