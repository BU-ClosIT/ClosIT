import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firebaseConfigBuilder } from "./services/firebase-services";
import aiQueryOnRequest from "./on-request/aiQueryOnRequest";
import weatherByLocationOnRequest from "./on-request/weatherByLocationOnRequest";
import outfitRecommendationOnRequest from "./on-request/outfitRecommendationOnRequest";
import getClosetByUserIdOnRequest from "./on-request/getClosetByUserIdOnRequest";
import setItemInClosetOnRequest from "./on-request/setItemInClosetOnRequest";
import devWeatherByLocationOnRequest from "./on-request/devWeatherByLocation";
import { updateItemOnRequest } from "./on-request/updateItemOnRequest";

const app = admin.initializeApp(firebaseConfigBuilder());

export const aiQuery = functions.https.onRequest((request, response) => {
  return aiQueryOnRequest({ request, response, app });
});

export const getWeatherByLocation = functions.https.onRequest(
  (request, response) => {
    return weatherByLocationOnRequest({ request, response, app });
  }
);
export const devGetWeatherByLocation = functions.https.onRequest(
  (request, response) => {
    return devWeatherByLocationOnRequest({ request, response, app });
  }
);

// Frontend-dashboard
export const getOutfitRecommendation = functions.https.onRequest(
  (request, response) => {
    return outfitRecommendationOnRequest({ request, response, app });
  }
);

export const getClosetByUserId = functions.https.onRequest(
  (request, response) => {
    return getClosetByUserIdOnRequest({ request, response, app });
  }
);

export const setItemInCloset = functions.https.onRequest(
  (request, response) => {
    return setItemInClosetOnRequest({ request, response, app });
  }
);

export const updateItemInCloset = functions.https.onRequest(
  (request, response) => {
    return updateItemOnRequest({ request, response, app });
  }
);
