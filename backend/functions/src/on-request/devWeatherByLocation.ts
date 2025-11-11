import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { getGeoPositionFromIp, getIpFromReq } from "../services/geoip-services";
// import { isOriginAllowed } from "../util/originUtil";
import { getCurrentWeatherByLatLong } from "../services/visualcrossing-services";

const devWeatherByLocationOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  //   const origin = `${request.header("x-closit-referrer")}`;
  //   functions.logger.log("weatherByLocation invoked by - " + origin);
  //   if (!origin || !isOriginAllowed(origin)) {
  //     response.status(400).send("Unauthorized");
  //     return;
  //   }

  const clientIp = getIpFromReq({ request });
  if (!clientIp) {
    response.status(500).send("Could not determine client IP");
    return;
  }

  try {
    const geoPosition = await getGeoPositionFromIp({ ip: clientIp });
    functions.logger.log("Geo position fetched:", geoPosition);
    const currentWeather = await getCurrentWeatherByLatLong({
      latLong: `${geoPosition.lat},${geoPosition.lon}`,
      selectedUnit: "F",
      app,
    });
    functions.logger.log("Current weather fetched:", currentWeather);
    response.status(200).send(
      JSON.stringify({
        ...currentWeather,
        city: geoPosition.city,
        region: geoPosition.region,
        country: geoPosition.country,
      })
    );
  } catch (error: any) {
    functions.logger.error("Error fetching weather data", error);
    response.status(500).send(`Error fetching weather data: ${error.message}`);
  }
};

export default devWeatherByLocationOnRequest;
