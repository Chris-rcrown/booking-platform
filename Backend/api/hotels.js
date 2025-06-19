// api/hotels.js

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { getAccessToken } = require("./utils");

const router = express.Router();
router.use(cors());

// 1) Search hotels in a city (cheapest room list)
//    GET /api/hotels?cityCode=PAR&checkInDate=2025-07-01&checkOutDate=2025-07-05&adults=1&roomQuantity=1
router.get("/", async (req, res) => {
  const {
    cityCode,
    checkInDate,
    checkOutDate,
    adults = 1,
    roomQuantity = 1,
    cacheControl,
  } = req.query;
  if (!cityCode || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: "MISSING_PARAMS",
      detail: "cityCode, checkInDate & checkOutDate are required",
    });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/hotel-offers",
      {
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
          roomQuantity,
          cacheControl,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // resp.data.data is an array of hotel offers with cheapest room price
    res.json({ data: resp.data.data });
  } catch (err) {
    console.error("Hotels search error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res
      .status(status)
      .json(err.response?.data || { error: "HOTEL_SEARCH_FAILED" });
  }
});

// 2) Get all room offers for a hotel
//    GET /api/hotels/:hotelId/offers?adults=1&roomQuantity=1
router.get("/:hotelId/offers", async (req, res) => {
  const { hotelId } = req.params;
  const { adults = 1, roomQuantity = 1 } = req.query;
  if (!hotelId) {
    return res.status(400).json({ error: "hotelId is required" });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/hotel-offers/by-hotel",
      {
        params: { hotelId, adults, roomQuantity },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // resp.data.data is an array of detailed offers (rooms + rates)
    res.json({ data: resp.data.data });
  } catch (err) {
    console.error("Hotel offers error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res
      .status(status)
      .json(err.response?.data || { error: "HOTEL_OFFERS_FAILED" });
  }
});

// 3) Confirm a single offer
//    GET /api/hotels/offers/:offerId
router.get("/offers/:offerId", async (req, res) => {
  const { offerId } = req.params;
  if (!offerId) {
    return res.status(400).json({ error: "offerId is required" });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/hotel-offers/${offerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // resp.data contains full offer conditions & policies
    res.json(resp.data);
  } catch (err) {
    console.error("Offer confirm error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res
      .status(status)
      .json(err.response?.data || { error: "OFFER_CONFIRM_FAILED" });
  }
});

// 4) Complete the booking
//    POST /api/hotels/bookings
//    Body: { offerId, guests: [...], payments: [...] }
router.post("/bookings", async (req, res) => {
  const { offerId, guests, payments } = req.body;
  if (!offerId || !Array.isArray(guests) || !Array.isArray(payments)) {
    return res.status(400).json({
      error: "INVALID_BODY",
      detail: "offerId, guests[] and payments[] are required in the body",
    });
  }
  try {
    const token = await getAccessToken();
    const resp = await axios.post(
      "https://test.api.amadeus.com/v1/booking/hotel-bookings",
      { data: { offerId, guests, payments } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // resp.data contains your booking confirmation
    res.status(201).json(resp.data);
  } catch (err) {
    console.error("Booking error", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: "BOOKING_FAILED" });
  }
});

module.exports = router;
