//  Generic firebase.json with a single rewrite rule
//  This firebase.json replaces all of your individual rewrite rules with a single, generic one.
//  It directs all requests matching /api/** to a single, centralized Cloud Function named api.
//  This is a common pattern for creating a serverless API with dynamic routing handled inside your functions code.

// firebase.json - needs to be in JSON format
const firebaseJsonConfig = {
  hosting: {
    public: "public",
    ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
    rewrites: [
      {
        source: "/api/**",
        function: "api",
      },
      {
        source: "**",
        destination: "/index.html",
      },
    ],
  },
};

// Generic Cloud Function with Express.js router
// This example shows how to set up an Express.js application inside your Cloud Function to handle the routing logic.
// The Express router will take the place of the many individual rewrite rules you had before.
// The app.use() middleware strips the /api/ prefix from the request URL before it gets to the Express router.
// This allows your Express routes to be defined cleanly (e.g., app.get('/users')) without needing to repeat the /api prefix.

// functions/index.js
const functions = require("firebase-functions");
const express = require("express");

const app = express();

// Middleware to strip the /api prefix
// Firebase Hosting will send all requests matching /api/** to this function,
// but Express needs to see the URL without the prefix for routing.
app.use((req, res, next) => {
  if (req.url.startsWith("/api")) {
    req.url = req.url.substring(4); // Remove the '/api' prefix
  }
  next();
});

// Example of defining generic routes
app.get("/path-one", (req, res) => {
  // Logic for /api/path-one
  res.status(200).send("Handled request for /path-one");
});

app.post("/path-two", (req, res) => {
  // Logic for /api/path-two
  res.status(200).send("Handled request for /path-two");
});

// Use a wildcard to capture all other paths under /api/
// and return a 404 Not Found response.
app.all("*", (req, res) => {
  res.status(404).send("API endpoint not found.");
});

// Expose the Express app as a single Cloud Function
exports.api = functions.https.onRequest(app);
