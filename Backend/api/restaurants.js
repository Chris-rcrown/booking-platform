// api/restaurants.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

const router = express.Router();
router.use(cors());

router.get("/", async (req, res) => {
  const { latitude, longitude, radius = 5000, limit = 10 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      error: "MISSING_PARAMS",
      detail: "latitude & longitude required",
    });
  }

  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/pois",
      {
        params: {
          subType: "RESTAURANT",
          latitude,
          longitude,
          radius,
          "page[limit]": limit,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const places = resp.data.data.map((poi) => ({
      name: poi.name,
      category: poi.subType,
      latitude: poi.geoCode?.latitude,
      longitude: poi.geoCode?.longitude,
    }));

    res.json({ data: places });
  } catch (err) {
    console.error("Restaurants error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res
      .status(status)
      .json(err.response?.data || { error: "RESTAURANT_SEARCH_FAILED" });
  }
});

module.exports = router;
