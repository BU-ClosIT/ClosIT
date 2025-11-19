import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Response } from "express";
import { isAuthorizedRequest } from "../util/tokenUtil";
import { queryGeminiWithImage } from "../services/gemini-services";
import { setClosetItem } from "../util/dbUtil";
import { ClosetItem } from "../model/ClosetItem";

export const addFromPhotoOnRequest = async ({
  request,
  response,
  app,
}: {
  request: functions.https.Request;
  response: Response;
  app: admin.app.App;
}) => {
  const authorization = request.headers["authorization"];
  if (!authorization || !isAuthorizedRequest({ request, app })) {
    response.status(400).send("Unauthorized");
    return;
  }

  try {
    const { imgUrl, userId, imgId, imgFileName } = request.body;

    functions.logger.log(
      `Add From Photo requested for userId: ${userId} with imgUrl: ${imgUrl} and imgId: ${imgId}`
    );

    const base64Image = await fetchImageAsBase64(imgUrl);
    functions.logger.log(
      "Fetched image and converted to base64, querying Gemini"
    );
    const aiResp = await queryGeminiWithImage({
      query: `Analyze this image and return a JSON object with fields: {
      name: string,
      category: "Outerwear" | "Tops" | "Bottoms" | "Legwear" | "Footwear" | "Accessories" | "Bags" | "Misc";
      color: string,
      material: string,
      size: string,
      brand: string,
      seasons: ["Spring" | "Summer" | "Fall" | "Winter" | "All"][]
      }
      Ensure the response is strictly in JSON format with no additional text.`,
      app,
      base64Image,
    });

    if (!aiResp) {
      response.status(500).send("No response from AI service");
      return;
    }

    const cleanText = aiResp
      .replace("```json", "")
      .replace("```", "")
      .replace("\\n", "");
    functions.logger.log("Received AI response:", cleanText);
    const { name, category, color, material, size, brand } =
      JSON.parse(cleanText);

    const itemDetails: ClosetItem = {
      id: "",
      name,
      category,
      color,
      material,
      purchaseDate: Date.now().toString(),
      size,
      brand,
      imageUrl: imgUrl,
      imgId,
      imgFileName,
    };

    const itemInDb = await setClosetItem({
      userId,
      closetItem: itemDetails,
      app,
    });

    response.status(200).send({
      message: "Item details extracted",
      itemDetails,
      id: itemInDb,
    });
  } catch (e) {
    functions.logger.error("Error in addFromPhotoOnRequest", e);
    response.status(500).send(`Error in addFromPhotoOnRequest: ${e}`);
  }
};

// helper: fetch an image URL and return base64 string
export default async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}
