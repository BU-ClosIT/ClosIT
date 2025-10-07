import type { NextApiRequest, NextApiResponse } from "next";
import { usePathname } from "next/navigation";

const ENDPOINT_URL = "https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-closit-referrer": `http://localhost:3000`,
      },
    });

    const text = await response.text();

    // Try to parse JSON, otherwise return the raw text
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch {
      return res.status(response.status).send(text);
    }
  } catch (err: any) {
    console.error("Error proxying to getWeather", err);
    return res
      .status(500)
      .json({ error: "proxy_error", message: err?.message });
  }
}
