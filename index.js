// index.js (for local dev)
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Routers from /api/*.js
const airportsRouter = require("./api/airports");
const flightsRouter = require("./api/orignal");
const hotelsRouter = require("./api/hotels");
const restaurantsRouter = require("./api/restaurants");

const app = express();
app.use(cors());
app.use(express.json());

// Mount each router at its path
app.use("/api/airports", airportsRouter);
app.use("/api/flights", flightsRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/restaurants", restaurantsRouter);

// Optional: serve the built React app in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "TravelEase", "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Local API listening on http://localhost:${PORT}`)
);
