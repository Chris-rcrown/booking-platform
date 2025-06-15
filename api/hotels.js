// api/hotels.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

const router = express();
router.use(cors());

router.get("/", async (req, res) => {
  const {
    cityCode,
    checkInDate,
    checkOutDate,
    adults = 1,
    roomQuantity = 1,
  } = req.query;

  if (!cityCode || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: "MISSING_PARAMS",
      detail: "cityCode, checkInDate & checkOutDate required",
    });
  }

  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/hotel-offers",
      {
        params: { cityCode, checkInDate, checkOutDate, roomQuantity, adults },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json({ data: resp.data.data });
  } catch (err) {
    console.error("Hotels error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res
      .status(status)
      .json(err.response?.data || { error: "HOTEL_SEARCH_FAILED" });
  }
});

module.exports = router;
