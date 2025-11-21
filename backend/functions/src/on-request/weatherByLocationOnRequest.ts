import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { getGeoPositionFromIp, getIpFromReq } from "../services/geoip-services";
import { getCurrentWeatherByLatLong } from "../services/visualcrossing-services";
import { CurrentWeatherResponse } from "../model/VisualCrossing";
import { isAuthorizedRequest } from "../util/tokenUtil";

const weatherByLocationOnRequest = async ({
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

  const clientIp = getIpFromReq({ request });
  if (!clientIp) {
    response.status(500).send("Could not determine client IP");
    return;
  }

  try {
    const selectedUnit = request.query.selectedUnit || "F";
    const geoPosition = await getGeoPositionFromIp({ ip: clientIp });
    functions.logger.log("Geo position fetched:", geoPosition);
    const currentWeather = await getCurrentWeatherByLatLong({
      latLong: `${geoPosition.lat},${geoPosition.lon}`,
      selectedUnit: selectedUnit as "F" | "C",
      app,
    });
    functions.logger.log("Current weather fetched:", currentWeather);
    response.status(200).send(
      JSON.stringify({
        latitude: currentWeather.latitude,
        longitude: currentWeather.longitude,
        timezone: currentWeather.timezone,
        tzoffset: currentWeather.tzoffset,
        description: currentWeather.description,
        alerts: currentWeather.alerts,
        currentConditions: currentWeather.currentConditions,
        city: geoPosition.city,
        region: geoPosition.region,
        country: geoPosition.country,
        selectedUnit,
      } as CurrentWeatherResponse)
    );
  } catch (error: any) {
    functions.logger.error("Error fetching weather data", error);
    response.status(500).send(`Error fetching weather data: ${error.message}`);
  }
};

export default weatherByLocationOnRequest;
