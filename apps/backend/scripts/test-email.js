/**
 * Test Brevo SMTP — run from apps/backend:
 *   node scripts/test-email.js your@email.com
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const nodemailer = require("nodemailer");

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/test-email.js recipient@email.com");
  process.exit(1);
}

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

console.log("EMAIL_HOST:", EMAIL_HOST || "(missing)");
console.log("EMAIL_PORT:", EMAIL_PORT || "587");
console.log("EMAIL_USER:", EMAIL_USER ? `${EMAIL_USER.slice(0, 6)}...` : "(missing)");
console.log("EMAIL_PASS:", EMAIL_PASS ? "(set)" : "(missing)");
console.log("EMAIL_FROM:", EMAIL_FROM || "(missing)");

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
  console.error("\nMissing EMAIL_HOST, EMAIL_USER, or EMAIL_PASS in .env");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  secure: Number(EMAIL_PORT) === 465,
  requireTLS: Number(EMAIL_PORT) !== 465,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

(async () => {
  try {
    await transport.verify();
    console.log("\nSMTP connection: OK");

    const info = await transport.sendMail({
      from: EMAIL_FROM || EMAIL_USER,
      to,
      subject: "SubTracker SMTP test",
      text: "If you received this, Brevo SMTP is working.",
    });

    console.log("Test email sent:", info.messageId);
    process.exit(0);
  } catch (err) {
    console.error("\nSMTP FAILED:", err.message);
    if (/auth|535|credentials/i.test(err.message)) {
      console.error("→ Regenerate SMTP key in Brevo and update EMAIL_PASS");
    }
    if (/sender|from|verified/i.test(err.message)) {
      console.error("→ Verify sender in Brevo matches EMAIL_FROM");
    }
    process.exit(1);
  }
})();
