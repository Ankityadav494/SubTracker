const nodemailer = require("nodemailer");

let transporter = null;

const parseFrom = (fromStr) => {
  const raw = fromStr || "SubTracker";
  const match = String(raw).match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "SubTracker", email: raw.trim() };
};

const getFrom = () => process.env.EMAIL_FROM || process.env.EMAIL_USER;

const getTransporter = () => {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  const port = Number(EMAIL_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
};

/** Brevo HTTP API — works better on cloud hosts (Render) when SMTP IP is blocked */
const sendViaBrevoApi = async ({ to, subject, text, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const sender = parseFrom(getFrom());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  let res;
  try {
    res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Brevo API ${res.status}: ${body}`);
    if (/unauthorized|ip address|401/i.test(body)) {
      err.code = "BREVO_IP_BLOCKED";
    }
    throw err;
  }

  return true;
};

const sendViaSmtp = async ({ to, subject, text, html }) => {
  const transport = getTransporter();
  if (!transport) {
    const err = new Error(
      "Email not configured — set EMAIL_* or BREVO_API_KEY on Render"
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
    if (/unauthorized ip|525/i.test(err.message)) {
      err.code = "BREVO_IP_BLOCKED";
    }
    throw err;
  }

  return true;
};

const sendMail = async ({ to, subject, text, html }) => {
  if (process.env.BREVO_API_KEY) {
    await sendViaBrevoApi({ to, subject, text, html });
    return { sent: true, via: "api" };
  }

  await sendViaSmtp({ to, subject, text, html });
  return { sent: true, via: "smtp" };
};

const sendSignupOtp = async ({ to, name, otp }) => {
  const subject = "SubTracker — Your verification code";
  const text = `Hi ${name},\n\nYour SubTracker verification code is: ${otp}\n\nIt expires in 10 minutes.\n\nIf you did not sign up, ignore this email.`;
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1c1917">
      <h2 style="color:#0ea5e9">SubTracker</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Use this code to verify your email and complete registration:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0ea5e9;margin:24px 0">${otp}</p>
      <p style="color:#64748b;font-size:14px">Expires in <strong>10 minutes</strong>.</p>
      <p style="color:#64748b;font-size:14px">If you did not sign up, you can ignore this email.</p>
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
      <h2 style="color:#0ea5e9">SubTracker renewal reminder</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>These subscriptions renew within the next <strong>${daysBefore} day(s)</strong>:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f8fafc;text-align:left">
            <th style="padding:10px;border-bottom:1px solid #e2e8f0">Service</th>
            <th style="padding:10px;border-bottom:1px solid #e2e8f0">Amount</th>
            <th style="padding:10px;border-bottom:1px solid #e2e8f0">Renews</th>
          </tr>
        </thead>
        <tbody>
          ${subscriptions
            .map(
              (sub) => `
            <tr>
              <td style="padding:10px;border-bottom:1px solid #f1f5f9">
                <strong>${sub.name}</strong><br/>
                <span style="color:#64748b;font-size:12px">${sub.category}</span>
              </td>
              <td style="padding:10px;border-bottom:1px solid #f1f5f9">₹${sub.price}</td>
              <td style="padding:10px;border-bottom:1px solid #f1f5f9">
                ${daysUntil(sub.nextBillingDate)}<br/>
                <span style="color:#64748b;font-size:12px">${new Date(sub.nextBillingDate).toLocaleDateString("en-IN")}</span>
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="color:#64748b;font-size:14px">Manage reminders in SubTracker Settings.</p>
    </div>
  `;

  const result = await sendMail({ to, subject, text, html });
  return result.sent;
};

const verifyEmailConfig = async () => {
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": process.env.BREVO_API_KEY, accept: "application/json" },
      });
      if (res.ok) return { ok: true, via: "brevo-api" };
      return { ok: false, via: "brevo-api", error: await res.text() };
    } catch (e) {
      return { ok: false, via: "brevo-api", error: e.message };
    }
  }

  const transport = getTransporter();
  if (!transport) return { ok: false, error: "EMAIL_* not set" };

  try {
    await transport.verify();
    return { ok: true, via: "smtp" };
  } catch (e) {
    return { ok: false, via: "smtp", error: e.message };
  }
};

module.exports = {
  getTransporter,
  sendMail,
  sendSignupOtp,
  sendRenewalReminder,
  verifyEmailConfig,
};
