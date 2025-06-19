// index.js (local dev only—no React fallback)
const path = require("path");
const express = require("express");
const cors = require("cors");

// 1) Load .env in dev
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
}

// 2) Pull in all your routers
const airportsRouter = require("./api/airports");
const flightsRouter = require("./api/flights");
const hotelsRouter = require("./api/hotels");
const restaurantsRouter = require("./api/restaurants");
const authentication = require("./api/auth")

const app = express();
app.use(cors());
app.use(express.json());

// 3) Mount them
app.use("/api/airports", airportsRouter);
app.use("/api/flights", flightsRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/auth", authentication);

// 4) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Local API listening on http://localhost:${PORT}`);
});
