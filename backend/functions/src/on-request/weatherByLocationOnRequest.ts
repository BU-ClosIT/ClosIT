import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import {
  getCityKeyByGeoPosition,
  getCurrentWeatherByCityKey,
} from "../services/accuweather-services";
import { GeoIpResp } from "../model/GeoIp";

const weatherByLocationOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const forwardedFor = request.headers["x-forwarded-for"] as string | undefined;

  if (!forwardedFor) {
    response.send("Cannot determine client IP");
    return;
  }

  const clientIP = forwardedFor.split(",")[0].trim();

  try {
    const geoResp = await fetch(`http://ip-api.com/json/${clientIP}`);
    const geoJson: GeoIpResp = await geoResp.json();
    const geoPosition = `${geoJson.lat},${geoJson.lon}`;

    const cityKey = await getCityKeyByGeoPosition({ geoPosition, app });
    const currentWeather = await getCurrentWeatherByCityKey({ cityKey, app });

    response
      .status(200)
      .send(`Weather response placeholder for location: ${currentWeather}`);
  } catch (error: any) {
    functions.logger.error("Error fetching weather data", error);
    response.status(500).send(`Error fetching weather data: ${error.message}`);
  }
};

export default weatherByLocationOnRequest;
