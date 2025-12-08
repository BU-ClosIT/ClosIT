export function isValidIPv4(ip: string) {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
  return ipv4Regex.test(ip);
}

export function getClientIpFromHeaders(
  headers: Headers | Record<string, string | undefined>
) {
  const get = (name: string) => (headers as Headers).get(name);
  console.log("Headers:", headers);
  return (
    get("x-client-ip") ||
    get("x-nf-client-connection-ip") || // Netlify sometimes sets this
    get("cf-connecting-ip") ||
    get("x-real-ip") ||
    // x-forwarded-for can contain "a, b, c" — take the leftmost
    (get("x-forwarded-for") || "")?.split?.(",")?.[0]?.trim() ||
    ""
  );
}
