// api/airports.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

// In-memory cache for airport lookups (key: keyword, value: list)
const cache = new Map();

const router = express.Router();
router.use(cors());

router.get("/", async (req, res) => {
  const raw = req.query.keyword;
  const keyword = raw?.toString().trim().toUpperCase();
  console.log("➡️  /api/airports keyword =", raw);

  if (!keyword) {
    return res.status(400).json({
      error: "KEYWORD_REQUIRED",
      detail: "Please call /api/airports?keyword=<search term>",
    });
  }

  // Serve from cache
  if (cache.has(keyword)) {
    console.log("☑️  Cache hit for", keyword);
    return res.json({ data: cache.get(keyword) });
  }

  // Fetch access token
  let token;
  try {
    token = await getAccessToken();
  } catch (err) {
    console.error("🔑 Token error:", err.message);
    return res
      .status(500)
      .json({ error: "TOKEN_FETCH_FAILED", detail: err.message });
  }

  // Call Amadeus directly
  const url = "https://test.api.amadeus.com/v1/reference-data/locations";
  const params = { subType: "AIRPORT,CITY", keyword, "page[limit]": 50 };
  console.log("📡 Calling Amadeus:", url, params);

  let amadeusResp;
  try {
    amadeusResp = await axios.get(url, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("✈️ Amadeus fetch error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res
      .status(status)
      .json(
        err.response?.data || {
          error: "AMADEUS_FETCH_FAILED",
          detail: err.message,
        }
      );
  }

  // Transform results
  const list = (amadeusResp.data.data || [])
    .filter((loc) => loc.iataCode)
    .map((loc) => ({
      code: loc.iataCode,
      name: loc.name || loc.address?.cityName || loc.iataCode,
    }));

  // Cache and expire
  cache.set(keyword, list);
  setTimeout(() => cache.delete(keyword), 1000 * 60 * 60); // 1h
  console.log("✅ Returning", list.length, "airports for", keyword);

  return res.json({ data: list });
});

module.exports = router;
