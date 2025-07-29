const express = require("express");
const {
  requestWithdrawal,
  getMyWithdrawals,
} = require("../controllers/withdrawalController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, requestWithdrawal);
router.get("/", protect, getMyWithdrawals);

module.exports = router;
