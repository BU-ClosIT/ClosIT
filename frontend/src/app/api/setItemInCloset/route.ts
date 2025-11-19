const ENDPOINT_URL = "https://setItemInCloset-6p7lfy6g4a-uc.a.run.app/";

export async function POST(request: Request) {
  try {
    // Read request body (app-router Request)
    let reqBody: unknown = null;
    try {
      reqBody = await request.json();
    } catch (e) {
      // If body isn't JSON or is empty, try text
      try {
        const t = await request.text();
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

    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
<<<<<<< Updated upstream
=======
        "x-closit-referrer": `http://localhost:3000`, // TODO: change for production
>>>>>>> Stashed changes
      },
      body: JSON.stringify(reqBody),
    });
    return response;
  } catch (err: any) {
    console.error("Error proxying to setItemInCloset service:", err);
    return new Response(
      JSON.stringify({ error: "proxy_error", message: err?.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } 
}
