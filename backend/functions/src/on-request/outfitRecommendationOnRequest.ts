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
import { CityKeyResponse, CurrentWeatherResponse } from "../model/AccuWeather";

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
  const origin = `${request.headers["x-closit-referrer"]}`;
  functions.logger.log("outfitRecommendationOnRequest invoked by - " + origin);
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
    const cityKeyResponse: CityKeyResponse = await getCityKeyByGeoPosition({
      geoPosition,
      app,
    });
    const currentWeather: CurrentWeatherResponse =
      await getCurrentWeatherByCityKey({
        cityKey: cityKeyResponse.Key,
        app,
      });
    const resp = await queryGemini({
      query: JSON.stringify({
        prompt: "You are a helpful assistant for picking clothes",
        currentWeather,
        userPreferences: "", // future feature
        currentUserCloset:
          "placeholder for now, just make up some clothing elements that might work for the current weather",
      }), // get from DB eventually
      app,
    });

    response.send(`Outfit Recommendation: ${resp}`);
  } catch (e) {
    functions.logger.error("Error fetching user closet data", e);
    response.status(500).send(`Error fetching user closet data: ${e}`);
    return;
  }
};

export default outfitRecommendationOnRequest;
