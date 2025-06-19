// api/utils.js
const path = require("path");
const axios = require("axios");

// 1) Load your .env from repo root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// 2) Grab credentials
const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

// 3) Helper to fetch an Amadeus OAuth token
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

module.exports = { getAccessToken };
