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

Set `MONGODB_URI` and `JWT_SECRET`.

**Frontend** (`apps/frontend/.env`):

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Default API URL: `http://localhost:5000/api`

### 3. Run

**Option A — both from root:**

```bash
npm run dev
```

**Option B — separate terminals:**

```bash
cd apps/backend && npm run dev
cd apps/frontend && npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  

## Run only one side

See folder-specific READMEs:

- [apps/frontend/README.md](apps/frontend/README.md)
- [apps/backend/README.md](apps/backend/README.md)

## API

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET/POST/PUT/DELETE | `/api/subscriptions` | Yes |

## Deploy frontend to AWS S3

```powershell
$env:S3_BUCKET = "your-bucket-name"
npm run deploy:s3
```

Set `VITE_API_URL` in `apps/frontend/.env` to your production API before building.

## License

MIT
