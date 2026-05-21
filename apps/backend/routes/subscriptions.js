const express = require("express");
const Subscription = require("../models/Subscription");
const { protect } = require("../middleware/auth");
const {
  appendPriceHistory,
  buildSubscriptionQuery,
  getSortOption,
  monthlyEquivalent,
} = require("../utils/subscriptionUtils");
const { recalculateMonthlySpend } = require("../utils/spendLog");

const router = express.Router();
router.use(protect);

const canAccess = (sub, user) =>
  sub.user.toString() === user._id.toString() ||
  (user.household &&
    sub.household &&
    sub.household.toString() === user.household.toString());

// GET /api/subscriptions?search=&category=&status=&sort=
router.get("/", async (req, res) => {
  try {
    const query = buildSubscriptionQuery(req.user, {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
    });

    const subscriptions = await Subscription.find(query).sort(
      getSortOption(req.query.sort)
    );
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/subscriptions/:id
router.get("/:id", async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub || !canAccess(sub, req.user)) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/subscriptions
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      nextBillingDate,
      billingCycle,
      status,
      notes,
      shareWithHousehold,
    } = req.body;

    if (!name || !price || !category || !nextBillingDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(price) <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be greater than 0" });
    }

    const numPrice = Number(price);
    const subscription = await Subscription.create({
      user: req.user._id,
      household:
        shareWithHousehold && req.user.household ? req.user.household : null,
      name,
      price: numPrice,
      billingCycle: billingCycle === "yearly" ? "yearly" : "monthly",
      category,
      status: ["active", "paused", "cancelled"].includes(status)
        ? status
        : "active",
      nextBillingDate: new Date(nextBillingDate),
      notes: notes || "",
      priceHistory: [{ price: numPrice, recordedAt: new Date() }],
    });

    await recalculateMonthlySpend(req.user._id);
    res.status(201).json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/subscriptions/:id
router.put("/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription || subscription.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const {
      name,
      price,
      category,
      nextBillingDate,
      billingCycle,
      status,
      notes,
    } = req.body;

    if (name) subscription.name = name;
    if (category) subscription.category = category;
    if (billingCycle) subscription.billingCycle = billingCycle;
    if (status) subscription.status = status;
    if (notes !== undefined) subscription.notes = notes;
    if (price !== undefined) {
      const numPrice = Number(price);
      if (numPrice !== subscription.price) {
        appendPriceHistory(subscription, numPrice);
        subscription.price = numPrice;
      }
    }
    if (nextBillingDate) {
      subscription.nextBillingDate = new Date(nextBillingDate);
      subscription.reminderSentAt = null;
    }

    await subscription.save();
    await recalculateMonthlySpend(req.user._id);
    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/subscriptions/:id
router.delete("/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await subscription.deleteOne();
    await recalculateMonthlySpend(req.user._id);
    res.json({ message: "Subscription removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
