// index.js
const path = require("path");
// 1. Load .env explicitly from project root
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// 2. Verify that credentials are loaded
console.log("🔍 Loading .env from:", path.resolve(__dirname, ".env"));
console.log("⚙️  Amadeus ID loaded?", !!process.env.AMADEUS_CLIENT_ID);
console.log("⚙️  Amadeus Secret loaded?", !!process.env.AMADEUS_CLIENT_SECRET);

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const FRONTEND = "https://dqg2pcpq-5174.uks1.devtunnels.ms";
app.use(cors({ origin: FRONTEND }));

// Helper: fetch Amadeus access token
async function getAccessToken() {
  const resp = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return resp.data.access_token;
}

// Health check
app.get("/", (_, res) => {
  res.send("Backend is running! Try /api/airports?keyword=LON or /api/flights");
});

// ---------------------------------------
// 1) Dynamic airport search (with debug)
// ---------------------------------------
app.get("/api/airports", async (req, res) => {
  // Debug: log what the server received
  console.log("➡️  /api/airports req.query =", req.query);

  const keyword = (req.query.keyword || "").toString().trim();
  if (!keyword) {
    return res.status(400).json({
      error: "KEYWORD_REQUIRED",
      detail: "Please call /api/airports?keyword=<search term>",
    });
  }

  try {
    const token = await getAccessToken();
    const amadeusResp = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        params: {
          subType: "AIRPORT,CITY",
          keyword: keyword,
          "page[limit]": 50,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const airports = (amadeusResp.data.data || [])
      .filter((loc) => !!loc.iataCode)
      .map((loc) => ({
        code: loc.iataCode,
        name: loc.name || loc.address?.cityName || loc.iataCode,
      }));

    return res.json({ data: airports });
  } catch (err) {
    console.error(
      "✈️  Airports fetch error:",
      err.response?.data || err.message
    );
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch airports list" });
  }
});

// ---------------------------------------
// 2) Flight search
// ---------------------------------------
function getTomorrowDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split("T")[0];
}

app.get("/api/flights", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { origin, destination, date, adults = 1, max = 10 } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "INVALID_PARAMETERS",
        detail: "Both `origin` and `destination` are required.",
      });
    }

    const departureDate = date || getTomorrowDate();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const userDate = new Date(departureDate);

    if (isNaN(userDate) || userDate < today) {
      return res.status(400).json({
        error: "INVALID_DATE",
        detail: "Departure date must be today or a future date.",
      });
    }

    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      max,
    };

    const apiResp = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.json(apiResp.data);
  } catch (err) {
    console.error(
      "✈️  Flight search error:",
      err.response?.data || err.message
    );
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch flight data" });
  }
});
// at top of index.js, after getAccessToken()...

// 3) Hotel search
// GET /api/hotels?cityCode=PAR&checkInDate=2025-07-01&checkOutDate=2025-07-05&adults=2&roomQuantity=1
app.get('/api/hotels', async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, adults = 1, roomQuantity = 1 } = req.query;
  if (!cityCode || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: 'MISSING_PARAMS', detail: 'cityCode, checkInDate & checkOutDate required' });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/hotel-offers',
      {
        params: { cityCode, checkInDate, checkOutDate, roomQuantity, adults },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // return the raw data or map to a simpler shape
    return res.json({ data: resp.data.data });
  } catch (err) {
    console.error('Hotels error', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json(err.response?.data || { error: 'HOTEL_SEARCH_FAILED' });
  }
});

// 4) Restaurant search (Points of Interest)
// GET /api/restaurants?latitude=48.8566&longitude=2.3522&radius=5000&limit=10
app.get('/api/restaurants', async (req, res) => {
  const { latitude, longitude, radius = 5000, limit = 10 } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'MISSING_PARAMS', detail: 'latitude & longitude required' });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations/pois',
      {
        params: {
          subType:       'RESTAURANT',
          latitude,
          longitude,
          radius,
          'page[limit]': limit
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // Map to simple { name, category, geoCode }
    const places = resp.data.data.map(poi => ({
      name: poi.name,
      category: poi.subType,
      latitude: poi.geoCode?.latitude,
      longitude: poi.geoCode?.longitude
    }));
    return res.json({ data: places });
  } catch (err) {
    console.error('Restaurants error', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json(err.response?.data || { error: 'RESTAURANT_SEARCH_FAILED' });
  }
});

// ---------------------------------------
// 5) Serve React in production
// ---------------------------------------
if (process.env.NODE_ENV === "production") {
  const expressPath = require("path");
  app.use(express.static(expressPath.join(__dirname, "TravelEase", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      expressPath.join(__dirname, "TravelEase", "dist", "index.html")
    );
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
