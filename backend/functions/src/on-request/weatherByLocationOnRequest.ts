import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import {
  getCityKeyByGeoPosition,
  getCurrentWeatherByCityKey,
} from "../services/accuweather-services";
import { getGeoPositionFromIp, getIpFromReq } from "../services/geoip-services";
import { isOriginAllowed } from "../util/originUtil";
import { CityKeyResponse, CurrentWeatherResponse } from "../model/AccuWeather";

const weatherByLocationOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const origin = `${request.header("x-closit-referrer")}`;
  functions.logger.log("weatherByLocation invoked by - " + origin);
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
    const geoPosition: string = await getGeoPositionFromIp({ ip: clientIp });
    const cityKeyResponse: CityKeyResponse = await getCityKeyByGeoPosition({
      geoPosition,
      app,
    });
    const currentWeather: CurrentWeatherResponse =
      await getCurrentWeatherByCityKey({ cityKey: cityKeyResponse.Key, app });

    response.status(200).send(
      JSON.stringify({
        ...currentWeather,
        city: cityKeyResponse.EnglishName,
        region: cityKeyResponse.Region.EnglishName,
        country: cityKeyResponse.Country.EnglishName,
        adminArea: cityKeyResponse.AdministrativeArea,
      })
    );
  } catch (error: any) {
    functions.logger.error("Error fetching weather data", error);
    response.status(500).send(`Error fetching weather data: ${error.message}`);
  }
};

export default weatherByLocationOnRequest;
