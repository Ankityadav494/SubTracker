/**
 * One-off email diagnostic — run: node -r dotenv/config scripts/diagnose-email.js
 * Delete after fixing; not for production deploy.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { verifyEmailConfig, sendSignupOtp } = require("../services/emailService");

const testTo = process.argv[2] || process.env.TEST_EMAIL;

(async () => {
  console.log("--- Email config ---");
  console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "set" : "missing");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "missing");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "set" : "missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "set" : "missing");
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "missing");

  const check = await verifyEmailConfig();
  console.log("\n--- verifyEmailConfig ---", check);

  if (!testTo) {
    console.log("\nPass recipient: node -r dotenv/config scripts/diagnose-email.js you@email.com");
    process.exit(check.ok ? 0 : 1);
  }

  console.log("\n--- Sending test OTP to", testTo, "---");
  try {
    await sendSignupOtp({ to: testTo, name: "Test", otp: "123456" });
    console.log("OK — check inbox (and spam)");
    process.exit(0);
  } catch (e) {
    console.error("FAIL:", e.message);
    process.exit(1);
  }
})();
