// api/auth.js
const express = require("express");
const router = express.Router();

// In-memory user store (swap out for a real DB later)
const users = [];

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ email, password });
  console.log("Registered Users:", users);
  res.status(201).json({ message: "Registration successful" });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // TODO: replace with real JWT or session token
  res.json({ message: "Login successful", user: { email } });
});

module.exports = router;
