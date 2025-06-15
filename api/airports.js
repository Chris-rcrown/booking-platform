// api/airports.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

const router = express();
router.use(cors());

router.get("/", async (req, res) => {
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
        params: { subType: "AIRPORT,CITY", keyword, "page[limit]": 50 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const airports = (amadeusResp.data.data || [])
      .filter((loc) => !!loc.iataCode)
      .map((loc) => ({
        code: loc.iataCode,
        name: loc.name || loc.address?.cityName || loc.iataCode,
      }));

    res.json({ data: airports });
  } catch (err) {
    console.error(
      "✈️  Airports fetch error:",
      err.response?.data || err.message
    );
    if (err.response)
      return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ error: "Failed to fetch airports list" });
  }
});

module.exports = router;
