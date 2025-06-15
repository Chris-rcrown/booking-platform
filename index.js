// index.js (project root)

const path = require("path");
const express = require("express");
const cors = require("cors");

// 1) Load .env
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// 2) Routers from /api/*
const airportsRouter = require("./api/airports");
const flightsRouter = require("./api/flights");
const hotelsRouter = require("./api/hotels");
const restaurantsRouter = require("./api/restaurants");

const app = express();
app.use(cors());
app.use(express.json());

// 3) Mount each router
app.use("/api/airports", airportsRouter);
app.use("/api/flights", flightsRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/restaurants", restaurantsRouter);

// 4) (Optional) Serve React in prod
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "TravelEase", "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// 5) Start local server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Listening on http://localhost:${PORT}`));
