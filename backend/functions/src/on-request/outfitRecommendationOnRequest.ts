import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { queryGemini } from "../services/gemini-services";
import { getGeoPositionFromIp, getIpFromReq } from "../services/geoip-services";
import {
  getCityKeyByGeoPosition,
  getCurrentWeatherByCityKey,
} from "../services/accuweather-services";
import { isOriginAllowed } from "../util/originUtil";

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
  const origin = request.headers.origin;
  if (!origin || !isOriginAllowed(origin)) {
    response.status(400).send("Unauthorized");
    return;
  }

  const clientIp = getIpFromReq({ request });
  if (!clientIp) {
    response.status(500).send("Could not determine client IP");
    return;
  }

  try {
    const geoPosition = await getGeoPositionFromIp({ ip: clientIp });
    const cityKey = await getCityKeyByGeoPosition({ geoPosition, app });
    const currentWeather = await getCurrentWeatherByCityKey({ cityKey, app });
    const resp = await queryGemini({
      query: JSON.stringify({
        currentWeather,
        userPreferences: "",
        currentUserCloset:
          "placeholder for now, just make up some clothing elements that might work for the current weather",
      }),
      app,
    });

    response.send(`Outfit Recommendation: ${resp}`);
  } catch (e) {
    functions.logger.error("Error fetching user closet data", e);
    response.status(500).send(`Error fetching user closet data: ${e}`);
    return;
  }
  // call Gemini endpoint
};

export default outfitRecommendationOnRequest;
