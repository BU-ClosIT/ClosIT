import { CurrentWeatherResponse } from "./VisualCrossing";

/** The shape of the request from the frontend when
 * the app asks for current weather outfit recommendation */
export type OutfitRequest = {
  currentWeather?: CurrentWeatherResponse;
  userPreferences: string;
  userId: string;
};
