const ENDPOINT_URL = "https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app/";

export async function GET(req: Request) {
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

    return new Response(JSON.stringify(body), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
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
