const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const { sendRenewalReminder, getTransporter } = require("../services/emailService");

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const runReminderJob = async () => {
  if (!getTransporter()) return;

  const daysBefore = Number(process.env.REMINDER_DAYS_BEFORE) || 3;
  const today = startOfDay(new Date());
  const windowEnd = addDays(today, daysBefore);

  const dueSoon = await Subscription.find({
    status: "active",
    nextBillingDate: { $gte: today, $lte: windowEnd },
    $or: [
      { reminderSentAt: null },
      { reminderSentAt: { $lt: today } },
    ],
  }).populate("user", "name email emailRemindersEnabled reminderDaysBefore");

  const byUser = new Map();

  for (const sub of dueSoon) {
    if (!sub.user?.email) continue;
    const key = sub.user._id.toString();
    if (!byUser.has(key)) {
      byUser.set(key, { user: sub.user, subscriptions: [] });
    }
    byUser.get(key).subscriptions.push(sub);
  }

  for (const { user, subscriptions } of byUser.values()) {
    if (user.emailRemindersEnabled === false) continue;

    try {
      const sent = await sendRenewalReminder({
        to: user.email,
        userName: user.name,
        subscriptions,
      });

      if (sent) {
        const ids = subscriptions.map((s) => s._id);
        await Subscription.updateMany(
          { _id: { $in: ids } },
          { reminderSentAt: new Date() }
        );
        console.log(
          `Reminder sent to ${user.email} (${subscriptions.length} subscription(s))`
        );
      }
    } catch (err) {
      console.error(`Reminder failed for ${user.email}:`, err.message);
    }
  }
};

const startReminderCron = () => {
  const schedule = process.env.REMINDER_CRON || "0 9 * * *";

  if (!getTransporter()) {
    console.log("Reminder cron skipped — configure email in .env");
    return;
  }

  cron.schedule(schedule, () => {
    console.log("Running subscription reminder job...");
    runReminderJob().catch((err) =>
      console.error("Reminder job error:", err)
    );
  });

  console.log(`Reminder cron scheduled: ${schedule}`);
};

module.exports = { startReminderCron, runReminderJob };
