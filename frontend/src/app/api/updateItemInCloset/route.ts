const ENDPOINT_URL = "https://updateItemInCloset-6p7lfy6g4a-uc.a.run.app/";

export async function POST(request: Request) {
  try {
    // Read request body (app-router Request)
    const { userId, itemId, updatedFields } = await request.json();

    // Call the backend function to update the item
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      },
      body: JSON.stringify({
        userId,
        itemId,
        updatedFields,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update item");
    }

    return new Response("Item updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response("Error updating item", { status: 500 });
  }
}
