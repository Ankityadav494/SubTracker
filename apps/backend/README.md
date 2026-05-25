# SubTracker — Backend

Node.js + Express + MongoDB + JWT API for SubTracker.

## Run standalone (this folder only)

```bash
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
```

API: http://localhost:5000/api/health

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing tokens |
| `CLIENT_URL` | No | Frontend URL for CORS (default `http://localhost:5173`) |
| `EMAIL_*` | For OTP + reminders | Brevo SMTP (`smtp-relay.brevo.com`) |
| `BREVO_API_KEY` | Recommended on Render | Brevo API key (avoids SMTP IP blocks) |
| `GEMINI_API_KEY` | For YaarBot | Google AI Studio key |

## Deploy on Render

| Setting | Value |
|---------|--------|
| Root Directory | `apps/backend` |
| Build Command | `npm install --omit=dev` |
| Start Command | `npm start` |

Set `CLIENT_URL` to your frontend URL (no trailing slash). Comma-separate for multiple origins, e.g. `http://localhost:5173,https://your-app.amplifyapp.com`.

Health check: `https://YOUR-SERVICE.onrender.com/api/health`

**OTP on Render free tier:** SMTP is blocked. You must set `BREVO_API_KEY` (not the SMTP key):

1. [Brevo → API Keys](https://app.brevo.com/settings/keys/api) → Generate (Transactional)
2. Locally: `npm run setup:brevo -- YOUR_API_KEY`
3. Render → Environment → add `BREVO_API_KEY` → Manual Deploy
4. Check: `GET /api/health/email` should show `"mode":"brevo-api"`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |

## Frontend

The React app lives in a **separate folder**: `../frontend/`.
