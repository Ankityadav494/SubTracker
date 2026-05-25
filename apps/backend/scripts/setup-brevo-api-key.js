/**
 * Save and test Brevo API key (required on Render).
 * Usage: node scripts/setup-brevo-api-key.js YOUR_API_KEY
 */
const fs = require("fs");
const path = require("path");

const apiKey = (process.argv[2] || "").trim();
const envPath = path.join(__dirname, "..", ".env");

if (!apiKey) {
  console.error("Usage: node scripts/setup-brevo-api-key.js <BREVO_API_KEY>");
  console.error("Get key: https://app.brevo.com/settings/keys/api → Generate API key");
  process.exit(1);
}

if (apiKey.startsWith("xsmtpsib-")) {
  console.error("That is an SMTP key. Create a separate API key (usually starts with xkeysib-).");
  process.exit(1);
}

let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

if (/^BREVO_API_KEY=/m.test(env)) {
  env = env.replace(/^BREVO_API_KEY=.*$/m, `BREVO_API_KEY=${apiKey}`);
} else {
  env += `\nBREVO_API_KEY=${apiKey}\n`;
}

if (/^EMAIL_FROM=/m.test(env)) {
  env = env.replace(
    /^EMAIL_FROM=.*$/m,
    "EMAIL_FROM=SubTracker <ankityadavbkpur@gmail.com>"
  );
}

fs.writeFileSync(envPath, env.trimEnd() + "\n");
process.env.BREVO_API_KEY = apiKey;
process.env.EMAIL_FROM = "SubTracker <ankityadavbkpur@gmail.com>";

(async () => {
  const res = await fetch("https://api.brevo.com/v3/account", {
    headers: { "api-key": apiKey, accept: "application/json" },
  });
  const body = await res.text();
  if (!res.ok) {
    console.error("API key test failed:", body);
    process.exit(1);
  }
  console.log("BREVO_API_KEY saved to .env and verified.");
  console.log("\nCopy the same key to Render → subtracker-api → Environment:");
  console.log("  BREVO_API_KEY =", apiKey);
  console.log("  EMAIL_FROM = SubTracker <ankityadavbkpur@gmail.com>");
  console.log("\nThen: Manual Deploy on Render.");
})();
