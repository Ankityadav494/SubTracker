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

  const today = startOfDay(new Date());
  const users = await User.find({
    emailRemindersEnabled: { $ne: false },
    email: { $exists: true, $ne: "" },
  });

  for (const user of users) {
    const daysBefore = Math.min(
      30,
      Math.max(1, Number(user.reminderDaysBefore) || Number(process.env.REMINDER_DAYS_BEFORE) || 3)
    );
    const windowEnd = addDays(today, daysBefore);

    const ownerFilter = [{ user: user._id }];
    if (user.household) ownerFilter.push({ household: user.household });

    const subscriptions = await Subscription.find({
      status: "active",
      $and: [
        { $or: ownerFilter },
        { nextBillingDate: { $gte: today, $lte: windowEnd } },
        {
          $or: [
            { reminderSentAt: null },
            { reminderSentAt: { $lt: today } },
          ],
        },
      ],
    }).sort({ nextBillingDate: 1 });

    if (subscriptions.length === 0) continue;

    try {
      const sent = await sendRenewalReminder({
        to: user.email,
        userName: user.name,
        subscriptions,
        daysBefore,
      });

      if (sent) {
        const ids = subscriptions.map((s) => s._id);
        await Subscription.updateMany(
          { _id: { $in: ids } },
          { reminderSentAt: new Date() }
        );
        console.log(
          `Renewal email sent to ${user.email} (${subscriptions.length} subscription(s), ${daysBefore}d window)`
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
    console.log("Reminder cron skipped — configure EMAIL_* in apps/backend/.env");
    return;
  }

  cron.schedule(schedule, () => {
    console.log("Running subscription renewal email job...");
    runReminderJob().catch((err) =>
      console.error("Reminder job error:", err)
    );
  });

  console.log(`Renewal reminder emails scheduled: ${schedule}`);
};

module.exports = { startReminderCron, runReminderJob };
