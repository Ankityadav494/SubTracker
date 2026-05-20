# SubTracker — Frontend

React + Vite + Tailwind CSS client for SubTracker.

## Run standalone (this folder only)

```bash
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Backend

The API lives in a **separate folder**: `../backend/`. Start it before using auth or subscriptions.
