// api/flights.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

const router = express.Router();
router.use(cors());

function getTomorrowDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split("T")[0];
}

router.get("/", async (req, res) => {
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

    res.json(apiResp.data);
  } catch (err) {
    console.error(
      "✈️  Flight search error:",
      err.response?.data || err.message
    );
    if (err.response)
      return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

module.exports = router;
