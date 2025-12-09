import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import firebaseConfigBuilder from "./services/firebase-services";
import aiQueryOnRequest from "./on-request/aiQueryOnRequest";
import weatherByLocationOnRequest from "./on-request/weatherByLocationOnRequest";
import outfitRecommendationOnRequest from "./on-request/outfitRecommendationOnRequest";
import getClosetByUserIdOnRequest from "./on-request/getClosetByUserIdOnRequest";
import setItemInClosetOnRequest from "./on-request/setItemInClosetOnRequest";
import updateItemOnRequest from "./on-request/updateItemOnRequest";
import deleteClosetItemOnRequest from "./on-request/deleteClosetItemOnRequest";
import addFromPhotoOnRequest from "./on-request/addFromPhotoOnRequest";
import converseOnRequest from "./on-request/converseOnRequest";
import setOutfitOnRequest from "./on-request/setOutfitOnRequest";
import getOutfitsByUserIdOnRequest from "./on-request/getOutfitsByUserIdOnRequest";

const app = admin.initializeApp(firebaseConfigBuilder());

export const aiQuery = functions.https.onRequest((request, response) => {
  return aiQueryOnRequest({ request, response, app });
});

export const getWeatherByLocation = functions.https.onRequest(
  (request, response) => {
    return weatherByLocationOnRequest({ request, response, app });
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

export const deleteClosetItem = functions.https.onRequest(
  (request, response) => {
    return deleteClosetItemOnRequest({ request, response, app });
  }
);

export const addFromPhoto = functions.https.onRequest((request, response) => {
  return addFromPhotoOnRequest({ request, response, app });
});

export const converse = functions.https.onRequest((request, response) => {
  return converseOnRequest({ request, response, app });
});

export const setOutfit = functions.https.onRequest(
  (request, response) => {
    return setOutfitOnRequest({ request, response, app });
  }
);

export const getOutfitsByUserId = functions.https.onRequest(
  (request, response) => {
    return getOutfitsByUserIdOnRequest({ request, response, app });
  }
);
