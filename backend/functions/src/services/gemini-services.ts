// services for interacting with Gemini API
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { tokenByName } from "../util/dbUtil";
import { GoogleGenAI } from "@google/genai";

const genAiAgentBuilder = async ({ app }: { app: admin.app.App }) => {
  functions.logger.log("building genAI Agent");
  const secret = await tokenByName({ name: "gemini-api-key", app });

  return new GoogleGenAI({ apiKey: secret });
};

export const queryGemini = async ({
  query,
  app,
}: {
  query: string;
  app: admin.app.App;
}) => {
  const genAi = await genAiAgentBuilder({ app });

  const response = await genAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
  });

  return response.text;
};
