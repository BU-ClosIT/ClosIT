// methods for interacting with the accuweather API
import * as admin from "firebase-admin";
import { tokenByName } from "../util/dbUtil";
import * as functions from "firebase-functions";
import { CityKeyResponse, CurrentWeatherResponse } from "../model/AccuWeather";

/** Call accuweather api to get the city key */
//  https://dataservice.accuweather.com/locations/v1/cities/search?q={cityName}
export const getCityKeyByGeoPosition = async ({
  geoPosition,
  app,
}: {
  geoPosition: string;
  app: admin.app.App;
}): Promise<string> => {
  // call AccuWeather endpoint
  const key = await tokenByName({ name: "accuweather-api-key", app });
  const resp = await fetch(
    `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${geoPosition}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    }
  );

  const respJson = await resp.json();
  const cityKeyResponse = respJson as CityKeyResponse;
  functions.logger.log("fetched city key:", JSON.stringify(respJson));
  return cityKeyResponse.Key;
};

/** Call accuweather api to get the current weather by city key */
// https://dataservice.accuweather.com/currentconditions/v1/{locationKey}
export const getCurrentWeatherByCityKey = async ({
  cityKey,
  app,
}: {
  cityKey: string;
  app: admin.app.App;
}) => {
  // call AccuWeather endpoint
  const key = await tokenByName({ name: "accuweather-api-key", app });
  const resp = await fetch(
    `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    }
  );
  const respJson = await resp.json();
  const currentWeatherResponse = respJson as CurrentWeatherResponse;

  functions.logger.log(
    "fetched current weather:",
    JSON.stringify(currentWeatherResponse)
  );

  return currentWeatherResponse;
};
