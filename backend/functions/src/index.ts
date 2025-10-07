import { Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import aiQueryOnRequest from "./on-request/aiQueryOnRequest";
import weatherByLocationOnRequest from "./on-request/weatherByLocationOnRequest";
import outfitRecommendationOnRequest from "./on-request/outfitRecommendationOnRequest";
import { firebaseConfigBuilder } from "./services/firebase-services";

const app = admin.initializeApp(firebaseConfigBuilder());

export const helloWorld = functions.https.onRequest(
  (request: functions.https.Request, response: Response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  }
);

export const aiQuery = functions.https.onRequest((request, response) => {
  aiQueryOnRequest({ request, response, app });
});

export const getWeatherByLocation = functions.https.onRequest(
  (request, response) => {
    weatherByLocationOnRequest({ request, response, app });
  }
);

export const getOutfitRecommendation = functions.https.onRequest(
  (request, response) => {
    return outfitRecommendationOnRequest({ request, response, app });
  }
);
