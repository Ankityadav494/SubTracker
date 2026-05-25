const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "Email not configured (EMAIL_HOST, EMAIL_USER, EMAIL_PASS). OTP and reminders disabled."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
};

const getFrom = () => process.env.EMAIL_FROM || process.env.EMAIL_USER;

const sendMail = async ({ to, subject, text, html }) => {
  const transport = getTransporter();
  if (!transport) {
    const err = new Error(
      "Email not configured — set EMAIL_HOST, EMAIL_USER, EMAIL_PASS on Render"
    );
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }

  try {
    await transport.sendMail({
      from: getFrom(),
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[email] SMTP send failed:", err.message);
    throw err;
  }

  return { sent: true, logged: false };
};

const sendSignupOtp = async ({ to, name, otp }) => {
  const subject = "SubTracker — Your verification code";
  const text = `Hi ${name},\n\nYour SubTracker verification code is: ${otp}\n\nIt expires in 10 minutes.\n\nIf you did not sign up, ignore this email.`;
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1c1917">
      <h2 style="color:#ea580c">SubTracker</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Use this code to verify your email and complete registration:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#ea580c;margin:24px 0">${otp}</p>
      <p style="color:#78716c;font-size:14px">Expires in <strong>10 minutes</strong>.</p>
      <p style="color:#78716c;font-size:14px">If you did not sign up, you can ignore this email.</p>
    </div>
  `;

  await sendMail({ to, subject, text, html });
  return true;
};

const daysUntil = (date) => {
  const days = Math.ceil(
    (startOfDay(new Date(date)) - startOfDay(new Date())) / (86400000)
  );
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const sendRenewalReminder = async ({ to, userName, subscriptions, daysBefore }) => {
  const lines = subscriptions
    .map((sub) => {
      const when = daysUntil(sub.nextBillingDate);
      const dateStr = new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `• ${sub.name} (${sub.category}) — ₹${sub.price} — renews ${when} (${dateStr})`;
    })
    .join("\n");

  const subject = `SubTracker — ${subscriptions.length} renewal(s) coming up`;
  const text = `Hi ${userName},\n\nYou asked to be reminded ${daysBefore} day(s) before renewals. These are due soon:\n\n${lines}\n\nOpen SubTracker to review or cancel.\n`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1c1917">
      <h2 style="color:#ea580c">SubTracker renewal reminder</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>These subscriptions renew within the next <strong>${daysBefore} day(s)</strong>:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#fafaf9;text-align:left">
            <th style="padding:10px;border-bottom:1px solid #e7e5e4">Service</th>
            <th style="padding:10px;border-bottom:1px solid #e7e5e4">Amount</th>
            <th style="padding:10px;border-bottom:1px solid #e7e5e4">Renews</th>
          </tr>
        </thead>
        <tbody>
          ${subscriptions
            .map(
              (sub) => `
            <tr>
              <td style="padding:10px;border-bottom:1px solid #f5f5f4">
                <strong>${sub.name}</strong><br/>
                <span style="color:#78716c;font-size:12px">${sub.category}</span>
              </td>
              <td style="padding:10px;border-bottom:1px solid #f5f5f4">₹${sub.price}</td>
              <td style="padding:10px;border-bottom:1px solid #f5f5f4">
                ${daysUntil(sub.nextBillingDate)}<br/>
                <span style="color:#78716c;font-size:12px">${new Date(sub.nextBillingDate).toLocaleDateString("en-IN")}</span>
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="color:#78716c;font-size:14px">Manage reminders in SubTracker Settings.</p>
    </div>
  `;

  const result = await sendMail({ to, subject, text, html });
  return result.sent;
};

module.exports = {
  getTransporter,
  sendMail,
  sendSignupOtp,
  sendRenewalReminder,
};
