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
| `EMAIL_*` | No | SMTP settings for renewal reminder emails |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |

## Frontend

The React app lives in a **separate folder**: `../frontend/`.
