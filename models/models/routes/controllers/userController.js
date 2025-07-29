const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register new user
const registerUser = async (req, res) => {
  const { username, email, password, referral } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let referredBy = null;
    if (referral) {
      const refUser = await User.findOne({ referralCode: referral });
      if (refUser) {
        referredBy = refUser._id;
        // Give referral bonus
        refUser.coins += 10;
        await refUser.save();
      }
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      referredBy,
      referralCode: Math.random().toString(36).substring(2, 8),
    });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      coins: newUser.coins,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      coins: user.coins,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// 🚀 Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ coins: -1 })
      .limit(10)
      .select("username coins");

    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getLeaderboard,
};
