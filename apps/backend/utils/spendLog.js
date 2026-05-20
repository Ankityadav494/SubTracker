const MonthlySpend = require("../models/MonthlySpend");
const Subscription = require("../models/Subscription");
const { monthlyEquivalent } = require("./subscriptionUtils");

const recalculateMonthlySpend = async (userId) => {
  const subs = await Subscription.find({
    user: userId,
    status: "active",
  });

  const totalMonthly = subs.reduce(
    (sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle),
    0
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await MonthlySpend.findOneAndUpdate(
    { user: userId, year, month },
    {
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      subscriptionCount: subs.length,
      recordedAt: now,
    },
    { upsert: true, new: true }
  );
};

module.exports = { recalculateMonthlySpend };
