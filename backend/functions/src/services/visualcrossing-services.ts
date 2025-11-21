/* eslint-disable max-len */
import * as admin from "firebase-admin";
import { tokenByName } from "../util/dbUtil";
import * as functions from "firebase-functions";

/** Call visual crossing api to get the current weather by city key */
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{locationKey}/today/today
export const getCurrentWeatherByLatLong = async ({
  latLong,
  selectedUnit,
  app,
}: {
  latLong: string;
  selectedUnit: "F" | "C";
  app: admin.app.App;
}) => {
  // call Visual Crossing endpoint
  const key = await tokenByName({ name: "visual-crossing-api-key", app });
  const unitGroup = selectedUnit === "F" ? "us" : "metric";
  const params = new URLSearchParams({
    key,
    unitGroup,
    iconsSet: "icons1",
    include: "current,alerts",
    elements:
      "datetime,datetimeEpoch,temp,feelslike,humidity,dew,precip,preciptype,snow,snowdepth,visibility,cloudcover,icon,conditions,winddir,windgust,windspeed,sunrise,sunset,severetype,severity,urgency,description,effective,expires",
    contentType: "json",
  });

  functions.logger.log(
    `Fetching current weather for ${latLong} with unit ${selectedUnit}`
  );

  const resp = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latLong}/today/today?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const respJson = await resp.json();

  functions.logger.log("fetched current weather:", JSON.stringify(respJson));

  return respJson;
};
