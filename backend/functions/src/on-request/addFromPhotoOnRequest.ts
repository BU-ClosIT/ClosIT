import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";

export const addFromPhotoOnRequest = ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  response.send("Not implemented yet");
};

// helper: fetch an image URL and return base64 string
export default async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}
