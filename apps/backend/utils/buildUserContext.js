const Subscription = require("../models/Subscription");
const {
  buildSubscriptionQuery,
  monthlyEquivalent,
  yearlyEquivalent,
} = require("./subscriptionUtils");

const daysUntil = (date) => {
  const days = Math.ceil(
    (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return days;
};

const buildUserDashboardContext = async (user) => {
  const query = buildSubscriptionQuery(user, {});
  const subscriptions = await Subscription.find(query).sort({
    nextBillingDate: 1,
  });

  const active = subscriptions.filter((s) => s.status === "active");
  const paused = subscriptions.filter((s) => s.status === "paused");
  const cancelled = subscriptions.filter((s) => s.status === "cancelled");

  const totalMonthly = active.reduce(
    (sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle),
    0
  );
  const totalYearly = active.reduce(
    (sum, s) => sum + yearlyEquivalent(s.price, s.billingCycle),
    0
  );

  const byCategory = {};
  active.forEach((s) => {
    const m = monthlyEquivalent(s.price, s.billingCycle);
    byCategory[s.category] = (byCategory[s.category] || 0) + m;
  });

  const renewalsSoon = active
    .filter((s) => {
      const d = daysUntil(s.nextBillingDate);
      return d >= 0 && d <= 7;
    })
    .map((s) => ({
      name: s.name,
      date: new Date(s.nextBillingDate).toLocaleDateString("en-IN"),
      days: daysUntil(s.nextBillingDate),
      price: s.price,
      billingCycle: s.billingCycle,
    }));

  const subLines = subscriptions.length
    ? subscriptions
        .map((s) => {
          const monthly = monthlyEquivalent(s.price, s.billingCycle);
          return `- ${s.name}: ₹${s.price}/${s.billingCycle} (≈₹${Math.round(monthly)}/mo), category: ${s.category}, status: ${s.status}, next billing: ${new Date(s.nextBillingDate).toLocaleDateString("en-IN")}${s.notes ? `, notes: ${s.notes}` : ""}`;
        })
        .join("\n")
    : "(none)";

  const categoryLines = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `- ${cat}: ₹${Math.round(amt)}/month`)
    .join("\n");

  let budgetBlock = "Monthly budget: not set";
  if (user.monthlyBudget) {
    const spent = Math.round(totalMonthly * 100) / 100;
    const remaining = Math.round((user.monthlyBudget - totalMonthly) * 100) / 100;
    budgetBlock = `Monthly budget: ₹${user.monthlyBudget}, spent: ₹${spent}, remaining: ₹${remaining}, over budget: ${totalMonthly > user.monthlyBudget ? "yes" : "no"}`;
  }

  return `
USER PROFILE
- Name: ${user.name}
- Email: ${user.email}
- Reminder window: ${user.reminderDaysBefore ?? 3} days before renewal
- Email reminders: ${user.emailRemindersEnabled !== false ? "on" : "off"}

SPENDING SUMMARY (active subscriptions only)
- Active count: ${active.length}
- Paused: ${paused.length}, Cancelled: ${cancelled.length}
- Estimated monthly spend: ₹${Math.round(totalMonthly * 100) / 100}
- Estimated yearly spend: ₹${Math.round(totalYearly * 100) / 100}
${budgetBlock}

SPEND BY CATEGORY
${categoryLines || "(no active subscriptions)"}

RENEWALS IN NEXT 7 DAYS
${
  renewalsSoon.length
    ? renewalsSoon
        .map(
          (r) =>
            `- ${r.name}: ${r.date} (in ${r.days} day(s)), ₹${r.price}/${r.billingCycle}`
        )
        .join("\n")
    : "(none)"
}

ALL SUBSCRIPTIONS (user's dashboard data)
${subLines}
`.trim();
};

const SYSTEM_BASE = `You are YaarBot, the in-app assistant for SubTracker (subscription expense tracker).

RULES:
- Answer ONLY using the user's dashboard data below when they ask about their subscriptions, spending, budget, renewals, or savings.
- If they have no subscriptions, say so and suggest adding some in the app.
- Use ₹ for amounts. Be concise, friendly, and actionable.
- Do not invent subscriptions or numbers not in the data.
- For app how-to: Dashboard shows stats; Add page creates subs; Settings has budget and reminders.
- If asked something unrelated to subscriptions or their data, briefly help then steer back to their SubTracker dashboard.
- Refer to yourself as YaarBot when appropriate.`;

const buildSystemInstruction = (dashboardContext) =>
  `${SYSTEM_BASE}\n\n--- USER DASHBOARD DATA (live) ---\n${dashboardContext}`;

module.exports = { buildUserDashboardContext, buildSystemInstruction };
