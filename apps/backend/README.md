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

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |

## Frontend

The React app lives in a **separate folder**: `../frontend/`.
