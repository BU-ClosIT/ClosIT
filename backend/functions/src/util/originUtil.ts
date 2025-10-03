// a set of functions for handling CORS and origins, making sure that a request is allowed

const allowedOrigins = [
  "http://localhost:3000",
  "https://closit.app",
  "https://www.closit.app",
];

export const isOriginAllowed = (origin: string): boolean => {
  return allowedOrigins.includes(origin);
};
