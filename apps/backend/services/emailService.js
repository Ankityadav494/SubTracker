const nodemailer = require("nodemailer");

let transporter587 = null;

const isCloudHost = Boolean(
  process.env.RENDER_SERVICE_ID || process.env.RENDER_EXTERNAL_URL
);

const trimEnv = (key) => process.env[key]?.trim() || "";

const parseFrom = (fromStr) => {
  const raw = fromStr || "SubTracker";
  const match = String(raw).match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "SubTracker", email: raw.trim() };
};

const getFrom = () => trimEnv("EMAIL_FROM") || trimEnv("EMAIL_USER");

const getBrevoApiKey = () => {
  const key = trimEnv("BREVO_API_KEY");
  if (!key) return "";
  if (key.startsWith("xsmtpsib-")) {
    console.error(
      "[email] BREVO_API_KEY is your SMTP key — create an API key at https://app.brevo.com/settings/keys/api"
    );
    return "";
  }
  return key;
};

const createSmtpTransport = (port) => {
  const EMAIL_HOST = trimEnv("EMAIL_HOST") || "smtp-relay.brevo.com";
  const EMAIL_USER = trimEnv("EMAIL_USER");
  const EMAIL_PASS = trimEnv("EMAIL_PASS");

  if (!EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    connectionTimeout: isCloudHost ? 8000 : 15000,
    greetingTimeout: isCloudHost ? 8000 : 15000,
    socketTimeout: isCloudHost ? 10000 : 20000,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
};

const getTransporter587 = () => {
  if (transporter587) return transporter587;
  transporter587 = createSmtpTransport(Number(trimEnv("EMAIL_PORT")) || 587);
  return transporter587;
};

const sendViaBrevoApi = async ({ to, subject, text, html }) => {
  const apiKey = getBrevoApiKey();
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
    if (/unauthorized|invalid api|key not found|401/i.test(body)) {
      err.code = "BREVO_API_KEY_INVALID";
    } else if (/sender|not verified|invalid from/i.test(body)) {
      err.code = "BREVO_SENDER_INVALID";
    } else if (/ip address|525/i.test(body)) {
      err.code = "BREVO_IP_BLOCKED";
    }
    throw err;
  }

  return true;
};

const sendViaResend = async ({ to, subject, text, html }) => {
  const apiKey = trimEnv("RESEND_API_KEY");
  if (!apiKey) return false;

  const from = trimEnv("RESEND_FROM") || getFrom() || "SubTracker <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Resend ${res.status}: ${body}`);
    err.code = "RESEND_FAILED";
    throw err;
  }

  return true;
};

const sendViaGmailWebhook = async ({ to, subject, text, html }) => {
  const url = trimEnv("EMAIL_WEBHOOK_URL");
  if (!url) return false;

  const headers = { "Content-Type": "application/json" };
  const secret = trimEnv("EMAIL_WEBHOOK_SECRET");
  if (secret) headers["X-Webhook-Secret"] = secret;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ to, subject, text, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gmail webhook ${res.status}: ${body}`);
  }

  return true;
};

const sendViaSmtpPort = async (port, { to, subject, text, html }) => {
  const transport = port === 587 ? getTransporter587() : createSmtpTransport(port);
  if (!transport) {
    const err = new Error("EMAIL_USER and EMAIL_PASS required for SMTP");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }

  await transport.sendMail({ from: getFrom(), to, subject, text, html });
  return true;
};

const sendMail = async ({ to, subject, text, html }) => {
  const attempts = [];

  if (getBrevoApiKey()) {
    attempts.push(async () => {
      await sendViaBrevoApi({ to, subject, text, html });
      return "brevo-api";
    });
  }

  if (trimEnv("RESEND_API_KEY")) {
    attempts.push(async () => {
      await sendViaResend({ to, subject, text, html });
      return "resend";
    });
  }

  if (trimEnv("EMAIL_WEBHOOK_URL")) {
    attempts.push(async () => {
      await sendViaGmailWebhook({ to, subject, text, html });
      return "gmail-webhook";
    });
  }

  if (!isCloudHost) {
    attempts.push(async () => {
      await sendViaSmtpPort(587, { to, subject, text, html });
      return "smtp-587";
    });
  } else {
    // Render free tier blocks 587/465/25; try 2525 before failing
    attempts.push(async () => {
      await sendViaSmtpPort(2525, { to, subject, text, html });
      return "smtp-2525";
    });
  }

  const errors = [];
  for (const attempt of attempts) {
    try {
      const via = await attempt();
      return { sent: true, via };
    } catch (err) {
      console.error("[email] attempt failed:", err.message);
      errors.push(err);
    }
  }

  if (isCloudHost && !getBrevoApiKey() && !trimEnv("RESEND_API_KEY") && !trimEnv("EMAIL_WEBHOOK_URL")) {
    const err = new Error(
      "On Render, set BREVO_API_KEY (https://app.brevo.com/settings/keys/api) — SMTP ports 587/465 are blocked."
    );
    err.code = "BREVO_API_KEY_REQUIRED";
    throw err;
  }

  const last = errors[errors.length - 1];
  if (last?.code) throw last;
  throw last || new Error("All email methods failed");
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

const getEmailStatus = () => {
  const apiKey = getBrevoApiKey();
  const smtpReady = Boolean(trimEnv("EMAIL_USER") && trimEnv("EMAIL_PASS"));
  const resend = Boolean(trimEnv("RESEND_API_KEY"));
  const webhook = Boolean(trimEnv("EMAIL_WEBHOOK_URL"));

  if (apiKey) {
    return { ok: true, mode: "brevo-api", cloudHost: isCloudHost };
  }
  if (resend) return { ok: true, mode: "resend", cloudHost: isCloudHost };
  if (webhook) return { ok: true, mode: "gmail-webhook", cloudHost: isCloudHost };

  if (isCloudHost) {
    return {
      ok: false,
      mode: "none",
      cloudHost: true,
      smtpConfigured: smtpReady,
      hint:
        "Add BREVO_API_KEY on Render (https://app.brevo.com/settings/keys/api). SMTP 587 is blocked on free tier.",
    };
  }

  if (!smtpReady) {
    return { ok: false, mode: "none", hint: "Set EMAIL_* or BREVO_API_KEY in .env" };
  }

  return { ok: true, mode: "smtp-local", cloudHost: false };
};

const verifyEmailConfig = async () => {
  const apiKey = getBrevoApiKey();
  if (apiKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": apiKey, accept: "application/json" },
      });
      if (res.ok) return { ok: true, via: "brevo-api" };
      const text = await res.text();
      return {
        ok: false,
        via: "brevo-api",
        error: text,
        code: /key not found|unauthorized/i.test(text)
          ? "BREVO_API_KEY_INVALID"
          : undefined,
      };
    } catch (e) {
      return { ok: false, via: "brevo-api", error: e.message };
    }
  }

  if (trimEnv("RESEND_API_KEY")) {
    return { ok: true, via: "resend" };
  }

  if (trimEnv("EMAIL_WEBHOOK_URL")) {
    return { ok: true, via: "gmail-webhook" };
  }

  if (isCloudHost) {
    return {
      ok: false,
      via: "none",
      error: "BREVO_API_KEY required on Render",
      code: "BREVO_API_KEY_REQUIRED",
    };
  }

  const transport = getTransporter587();
  if (!transport) return { ok: false, error: "EMAIL_* not set" };

  try {
    await transport.verify();
    return { ok: true, via: "smtp" };
  } catch (e) {
    return { ok: false, via: "smtp", error: e.message };
  }
};

module.exports = {
  getTransporter: getTransporter587,
  sendMail,
  sendSignupOtp,
  sendRenewalReminder,
  verifyEmailConfig,
  getEmailStatus,
};
