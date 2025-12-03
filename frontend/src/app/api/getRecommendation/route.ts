import { getClientIpFromHeaders, isValidIPv4 } from "../../../util/ip-util";
import { type NextRequest } from "next/server";

// backend firebase endpoint
const ENDPOINT_URL = "https://getoutfitrecommendation-6p7lfy6g4a-uc.a.run.app/";

export async function POST(req: NextRequest) {
  try {
    // Read request body (app-router Request)
    let reqBody: unknown = null;
    try {
      reqBody = await req.json();
    } catch (e) {
      // If body isn't JSON or is empty, try text
      try {
        const t = await req.text();
        if (t) {
          try {
            reqBody = JSON.parse(t);
          } catch {
            reqBody = t;
          }
        }
      } catch {
        reqBody = null;
      }
    }

    const ipFromHeaders = getClientIpFromHeaders(req.headers);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    };

    if (isValidIPv4(ipFromHeaders)) {
      headers["x-client-ip"] = ipFromHeaders;
    }

    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(reqBody),
    });
    console.log("Fetched response from recommendation service");
    const text = await response.text();
    console.log("Response from recommendation service:", text);
    // Try to parse JSON, otherwise return the raw text
    try {
      const json = JSON.parse(text);
      return new Response(json, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(text, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error proxying to Cloud Run recommendation service:", err);
    return new Response(
      JSON.stringify({ error: "proxy_error", message: err?.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
