// a set of functions for handling CORS and origins, making sure that a request is allowed

const allowedOrigins = ["http://localhost:3000"];

export const isOriginAllowed = (origin: string): boolean => {
  return allowedOrigins.includes(origin);
};
