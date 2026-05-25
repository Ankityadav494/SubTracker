# Deploy backend on Render

## Required settings

| Field | Value |
|--------|--------|
| Root Directory | `apps/backend` |
| Build Command | `npm install --omit=dev` |
| Start Command | `npm start` (runs `npm install` then `node server.js`) |
| Pre-Deploy | *(empty)* |

## Required environment variables

`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL`, `EMAIL_*`, `GEMINI_*`, `REMINDER_*`

### Email (Brevo) — required for signup OTP

| Variable | Example |
|----------|---------|
| `EMAIL_HOST` | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your Brevo login email (SMTP account) |
| `EMAIL_PASS` | Brevo **SMTP key** (not your Brevo password) |
| `EMAIL_FROM` | `SubTracker <verified-sender@yourdomain.com>` — must be a **verified sender** in Brevo |

If signup shows "Could not send verification code", open **Logs** and search for `[email] SMTP send failed`.

Do **not** set `PORT` (Render sets it).

## Verify

1. Logs must show: `MongoDB connected` then `Server running on...`
2. Open: `https://YOUR-SERVICE.onrender.com/api/health` → `{"status":"ok","service":"subtracker-api"}`

## If deploy fails

- Fix `MONGODB_URI` (no `<password>` brackets; same string as local `.env`)
- Clear build cache → Manual Deploy

## If `Cannot GET /api/health`

Deploy failed — an old/wrong app is still running. Fix deploy first; do not test until status is **Live** and logs show `MongoDB connected`.
