const Withdrawal = require("../models/Withdrawal");

const requestWithdrawal = async (req, res) => {
  const { amount, method, account } = req.body;
  const user = req.user;

  try {
    if (user.coins < amount) {
      return res.status(400).json({ message: "Not enough coins." });
    }

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      method,
      account,
    });

    // Deduct coins
    user.coins -= amount;
    await user.save();

    res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Error requesting withdrawal" });
  }
};

const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching withdrawal history" });
  }
};

module.exports = {
  requestWithdrawal,
  getMyWithdrawals,
};
