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

// GET /api/subscriptions/export
router.get("/export", async (req, res) => {
  try {
    const query = buildSubscriptionQuery(req.user, {});
    const subs = await Subscription.find(query).sort({ name: 1 });

    const header =
      "name,price,billingCycle,category,status,nextBillingDate,monthlyEquivalent,notes";
    const rows = subs.map((s) => {
      const monthly = monthlyEquivalent(s.price, s.billingCycle).toFixed(2);
      const date = new Date(s.nextBillingDate).toISOString().split("T")[0];
      const notes = (s.notes || "").replace(/,/g, ";");
      return `${s.name},${s.price},${s.billingCycle},${s.category},${s.status},${date},${monthly},${notes}`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="subtracker-export.csv"'
    );
    res.send([header, ...rows].join("\n"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/subscriptions/import
router.post("/import", async (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "rows array required" });
    }

    const created = [];
    for (const row of rows) {
      if (!row.name || !row.price || !row.category || !row.nextBillingDate) {
        continue;
      }

      const price = Number(row.price);
      if (price <= 0) continue;

      const sub = await Subscription.create({
        user: req.user._id,
        household: req.user.household || null,
        name: row.name,
        price,
        billingCycle: row.billingCycle === "yearly" ? "yearly" : "monthly",
        category: row.category,
        status: ["active", "paused", "cancelled"].includes(row.status)
          ? row.status
          : "active",
        nextBillingDate: new Date(row.nextBillingDate),
        notes: row.notes || "",
        priceHistory: [{ price, recordedAt: new Date() }],
      });
      created.push(sub);
    }

    await recalculateMonthlySpend(req.user._id);
    res.status(201).json({ imported: created.length, subscriptions: created });
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
