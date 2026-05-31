# SubTracker

Full-stack subscription management app to track recurring expenses, visualize spending by category, and get email reminders before renewals.

## Project structure (separate folders)

```
SubTracker/
├── apps/
│   ├── frontend/     ← React app (run independently)
│   └── backend/      ← Express API (run independently)
├── scripts/          ← AWS S3 deploy
├── package.json      ← Run both apps from root (optional)
└── README.md
```

Frontend and backend are **in different folders** — each has its own `package.json`, dependencies, and `.env`.

## Tech stack

| Folder | Technologies |
|--------|----------------|
| `apps/frontend` | React, Vite, Tailwind CSS, Chart.js, React Router |
| `apps/backend` | Node.js, Express, MongoDB, JWT, Nodemailer |

## Quick start (both apps)

### 1. Install

From project root:

```bash
npm run install:all
```

Or install each folder separately:

```bash
cd apps/backend && npm install
cd ../frontend && npm install
```

### 2. Environment

**Backend** (`apps/backend/.env`):

```bash
cp apps/backend/.env.example apps/backend/.env
```

Set `MONGODB_URI`, `JWT_SECRET`, and email (`EMAIL_*`) for OTP signup and renewal reminder emails.

**Brevo (Sendinblue):** use SMTP in `apps/backend/.env` — no code changes needed:

| Variable | Value |
|----------|--------|
| `EMAIL_HOST` | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your Brevo account email |
| `EMAIL_PASS` | SMTP key from Brevo → *SMTP & API* (not your login password) |
| `EMAIL_FROM` | A **verified sender** in Brevo, e.g. `SubTracker <hello@yourdomain.com>` |

Create the SMTP key and verify the sender in the [Brevo dashboard](https://app.brevo.com) before testing signup OTP.

**Frontend** (`apps/frontend/.env`):

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Default API URL: `http://localhost:5000/api`

### 3. Run

**Recommended (frontend + live Render API — avoids local MongoDB crashes):**

```bash
npm run dev
```

Uses Vite proxy to `https://subtracker-1-tsuh.onrender.com` (see `apps/frontend/.env.development.local`).

**Full local stack** (needs a working `MONGODB_URI` in `apps/backend/.env`):

```bash
npm run dev:full
```

If the backend exits with `querySrv ENOTFOUND`, your Atlas connection string is wrong or outdated — copy a new one from [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers.

- Frontend: http://localhost:5173  
- Backend (local): http://localhost:5000  

## Run only one side

See folder-specific READMEs:

- [apps/frontend/README.md](apps/frontend/README.md)
- [apps/backend/README.md](apps/backend/README.md)

## API

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/signup/send-otp` | No |
| POST | `/api/auth/signup/verify-otp` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET/POST/PUT/DELETE | `/api/subscriptions` | Yes |

