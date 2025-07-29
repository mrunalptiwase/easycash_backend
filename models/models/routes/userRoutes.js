const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getLeaderboard,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get profile (requires login)
router.get("/profile", protect, getUserProfile);

// Leaderboard (public)
router.get("/leaderboard", getLeaderboard);

module.exports = router;
