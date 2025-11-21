const ENDPOINT_URL = "https://deleteclosetitem-6p7lfy6g4a-uc.a.run.app";

export async function POST(request: Request) {
  try {
    // Read request body
    const { userId, itemId } = await request.json();

    if (!userId || !itemId) {
      return new Response(
        JSON.stringify({ error: "Missing userId or itemId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Firebase function
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      },
      body: JSON.stringify({ userId, itemId }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firebase function error: ${text}`);
    }

    return new Response(
      JSON.stringify({ message: `Item deleted successfully: ${itemId}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error deleting closet item:", err);
    return new Response(
      JSON.stringify({ error: "delete_error", message: err?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}