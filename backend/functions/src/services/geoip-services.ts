import * as functions from "firebase-functions";
import { GeoIpResp } from "../model/GeoIp";

/** get a clients IP from their request
 * @return {string | undefined} client's IP address
 */
export const getIpFromReq = ({
  request,
}: {
  request: functions.https.Request;
}): string | undefined => {
  const forwardedFor = request.headers["x-forwarded-for"] as string | undefined;

  if (!forwardedFor) {
    return;
  }

  const clientIP = forwardedFor.split(",")[0].trim();
  return clientIP;
};

/**
 * @return {string} lat and long for a given IP
 *
 * e.g. "42.3601,-71.0589" */
export const getGeoPositionFromIp = async ({
  ip,
}: {
  ip: string;
}): Promise<string> => {
  const geoResp = await fetch(`http://ip-api.com/json/${ip}`);
  const geoJson: GeoIpResp = await geoResp.json();
  const geoPosition = `${geoJson.lat},${geoJson.lon}`;
  return geoPosition;
};
