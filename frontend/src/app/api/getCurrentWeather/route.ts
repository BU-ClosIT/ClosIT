import {
  getClientIpFromHeaders,
  isValidIPv4,
  isValidIPv6,
} from "@/src/util/ip-util";
import { type NextRequest } from "next/server";

const ENDPOINT_URL = "https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app/";

export async function GET(req: NextRequest) {
  const ipFromHeaders = getClientIpFromHeaders(req.headers);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const isLocalHost = ipFromHeaders === "::1" || ipFromHeaders === "127.0.0.1";
  if (
    !isLocalHost &&
    (isValidIPv4(ipFromHeaders) || isValidIPv6(ipFromHeaders))
  ) {
    headers["x-client-ip"] = ipFromHeaders;
  }

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        ...headers,
      },
    });

    const text = await response.text();

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      // If response isn't JSON, return the raw text
      body = text;
    }

    return new Response(JSON.stringify(body), {
      status: response.status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error proxying to getWeather", err);
    return new Response(
      JSON.stringify({ error: "proxy_error", message: err?.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
