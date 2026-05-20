const express = require("express");
const Subscription = require("../models/Subscription");
const { protect } = require("../middleware/auth");
const { buildSubscriptionQuery } = require("../utils/subscriptionUtils");

const router = express.Router();
router.use(protect);

// GET /api/reminders
router.get("/", async (req, res) => {
  try {
    const daysBefore = req.user.reminderDaysBefore || 3;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowEnd = new Date(today);
    windowEnd.setDate(windowEnd.getDate() + daysBefore);

    const query = buildSubscriptionQuery(req.user, { status: "active" });
    const dueSoon = await Subscription.find({
      ...query,
      nextBillingDate: { $gte: today, $lte: windowEnd },
    }).sort({ nextBillingDate: 1 });

    res.json(dueSoon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
