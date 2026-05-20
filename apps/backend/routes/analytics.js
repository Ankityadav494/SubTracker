const express = require("express");
const Subscription = require("../models/Subscription");
const MonthlySpend = require("../models/MonthlySpend");
const { protect } = require("../middleware/auth");
const {
  buildSubscriptionQuery,
  monthlyEquivalent,
  yearlyEquivalent,
} = require("../utils/subscriptionUtils");

const router = express.Router();
router.use(protect);

// GET /api/analytics/overview
router.get("/overview", async (req, res) => {
  try {
    const query = buildSubscriptionQuery(req.user, {});
    const all = await Subscription.find(query);
    const active = all.filter((s) => s.status === "active");

    const totalMonthly = active.reduce(
      (sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle),
      0
    );
    const totalYearly = active.reduce(
      (sum, s) => sum + yearlyEquivalent(s.price, s.billingCycle),
      0
    );

    const breakdown = active
      .map((s) => {
        const monthly = monthlyEquivalent(s.price, s.billingCycle);
        return {
          _id: s._id,
          name: s.name,
          category: s.category,
          monthly,
          percentOfTotal: totalMonthly
            ? Math.round((monthly / totalMonthly) * 1000) / 10
            : 0,
        };
      })
      .sort((a, b) => b.monthly - a.monthly);

    const budget = req.user.monthlyBudget;
    const budgetStatus = budget
      ? {
          budget,
          spent: Math.round(totalMonthly * 100) / 100,
          remaining: Math.round((budget - totalMonthly) * 100) / 100,
          overBudget: totalMonthly > budget,
          percentUsed: Math.min(
            100,
            Math.round((totalMonthly / budget) * 1000) / 10
          ),
        }
      : null;

    res.json({
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
      activeCount: active.length,
      breakdown,
      budgetStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/trends
router.get("/trends", async (req, res) => {
  try {
    const logs = await MonthlySpend.find({ user: req.user._id })
      .sort({ year: -1, month: -1 })
      .limit(6);

    const trends = logs
      .reverse()
      .map((l) => ({
        label: `${l.year}-${String(l.month).padStart(2, "0")}`,
        totalMonthly: l.totalMonthly,
        count: l.subscriptionCount,
      }));

    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/savings
router.get("/savings", async (req, res) => {
  try {
    const query = buildSubscriptionQuery(req.user, { status: "active" });
    const active = await Subscription.find(query);
    const tips = [];

    const byCategory = {};
    active.forEach((s) => {
      byCategory[s.category] = byCategory[s.category] || [];
      byCategory[s.category].push(s);
    });

    Object.entries(byCategory).forEach(([cat, subs]) => {
      if (subs.length > 1) {
        tips.push({
          type: "duplicate_category",
          message: `You have ${subs.length} active ${cat} subscriptions (${subs.map((s) => s.name).join(", ")}). Consider consolidating.`,
          savingsEstimate: subs
            .slice(1)
            .reduce(
              (sum, s) =>
                sum + monthlyEquivalent(s.price, s.billingCycle),
              0
            ),
        });
      }
    });

    const paused = await Subscription.find({
      ...buildSubscriptionQuery(req.user, {}),
      status: "paused",
    });
    if (paused.length) {
      tips.push({
        type: "paused",
        message: `${paused.length} paused subscription(s) still on file — cancel if unused.`,
        savingsEstimate: paused.reduce(
          (sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle),
          0
        ),
      });
    }

    const renewalsThisWeek = active.filter((s) => {
      const days =
        (new Date(s.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 7;
    });
    if (renewalsThisWeek.length >= 3) {
      tips.push({
        type: "renewal_cluster",
        message: `${renewalsThisWeek.length} renewals this week — review before you're charged.`,
        savingsEstimate: null,
      });
    }

    const yearlyCouldSave = active
      .filter((s) => s.billingCycle === "monthly" && s.price >= 500)
      .slice(0, 2)
      .map((s) => ({
        type: "annual_plan",
        message: `Check if ${s.name} offers a cheaper annual plan.`,
        savingsEstimate: s.price * 2,
      }));

    res.json({
      tips: [...tips, ...yearlyCouldSave].slice(0, 6),
      totalPotentialSavings: tips.reduce(
        (sum, t) => sum + (t.savingsEstimate || 0),
        0
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
