const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "Email not configured (EMAIL_HOST, EMAIL_USER, EMAIL_PASS). Reminders disabled."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
};

const sendRenewalReminder = async ({ to, userName, subscriptions }) => {
  const transport = getTransporter();
  if (!transport) return false;

  const lines = subscriptions
    .map(
      (sub) =>
        `• ${sub.name} (${sub.category}) — ₹${sub.price} on ${new Date(
          sub.nextBillingDate
        ).toLocaleDateString()}`
    )
    .join("\n");

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transport.sendMail({
    from,
    to,
    subject: "SubTracker — Upcoming subscription renewals",
    text: `Hi ${userName},\n\nThese subscriptions renew soon:\n\n${lines}\n\nManage them in SubTracker.\n`,
    html: `
      <p>Hi <strong>${userName}</strong>,</p>
      <p>These subscriptions renew soon:</p>
      <ul>
        ${subscriptions
          .map(
            (sub) =>
              `<li><strong>${sub.name}</strong> (${sub.category}) — ₹${sub.price} on ${new Date(sub.nextBillingDate).toLocaleDateString()}</li>`
          )
          .join("")}
      </ul>
      <p>Manage them in SubTracker.</p>
    `,
  });

  return true;
};

module.exports = { sendRenewalReminder, getTransporter };
