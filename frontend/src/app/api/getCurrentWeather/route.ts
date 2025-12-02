import isValidIPv4 from "@/src/util/ip-util";
import { type NextRequest } from "next/server";

const ENDPOINT_URL = "https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app/";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      },
    });

    const text = await response.text();
    console.log("Response from weather service:", text);

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      // If response isn't JSON, return the raw text
      body = text;
    }

    const forwarded = req.headers.get("x-forwarded-for");
    // The first IP in the list is usually the client's original IP
    console.log({ forwarded });
    const forwardedFor =
      typeof forwarded === "string" ? forwarded.split(/, /)[0] : "";
    console.log({ forwardedFor });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isValidIPv4(forwardedFor)) {
      headers["x-forwarded-for"] = forwardedFor;
    }

    return new Response(JSON.stringify(body), {
      status: response.status,
      headers,
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
