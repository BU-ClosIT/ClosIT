import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT_URL = "https://getclosetbyuserid-6p7lfy6g4a-uc.a.run.app/";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-closit-referrer": `http://localhost:3000`, // TOOD: change for production
      },
      body: JSON.stringify(req.body),
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
    console.error("Error proxying to getClosetByUserId", err);
    return res
      .status(500)
      .json({ error: "proxy_error", message: err?.message });
  }
}
