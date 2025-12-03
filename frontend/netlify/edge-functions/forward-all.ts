export default async (request: Request) => {
  const reqHeaders = request.headers;

  // Determine client IP (Netlify-specific header first)
  const clientIp =
    reqHeaders.get("x-nf-client-connection-ip") ||
    reqHeaders.get("cf-connecting-ip") ||
    reqHeaders.get("x-real-ip") ||
    (reqHeaders.get("x-forwarded-for") || "").split(",")[0]?.trim() ||
    "";

  // Destination base: must be set in Netlify env
  const BACKEND_BASE =
    Deno.env.get("FIREBASE_API_BASE") ||
    Deno.env.get("REVERSE_PROXY_BASE") ||
    "";
  if (!BACKEND_BASE) {
    return new Response("BACKEND_BASE not configured", { status: 500 });
  }

  // Build dest path: strip /api prefix if your backend endpoints don't have it
  const incoming = new URL(request.url);
  let destPath = incoming.pathname;
  // adjust this rule to match how your backend expects paths
  if (destPath.startsWith("/api/")) destPath = destPath.replace(/^\/api/, "");
  const destUrl = new URL(destPath + incoming.search, BACKEND_BASE).toString();

  // Build headers to forward
  const forwardHeaders = new Headers();
  // copy a few useful headers
  const contentType = reqHeaders.get("content-type");
  if (contentType) forwardHeaders.set("content-type", contentType);
  const auth = reqHeaders.get("authorization");
  if (auth) forwardHeaders.set("authorization", auth);

  // trusted client IP header
  if (clientIp) {
    forwardHeaders.set("x-client-ip", clientIp);
    const existingXff = reqHeaders.get("x-forwarded-for");
    forwardHeaders.set(
      "x-forwarded-for",
      existingXff ? `${existingXff}, ${clientIp}` : clientIp
    );
  }

  // Forward body for non-GET/HEAD
  const method = request.method;
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const upstreamRes = await fetch(destUrl, {
    method,
    headers: forwardHeaders,
    body,
  });

  const responseBody = await upstreamRes.arrayBuffer();
  const responseHeaders = new Headers(upstreamRes.headers);
  responseHeaders.delete("set-cookie");

  return new Response(responseBody, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
};
