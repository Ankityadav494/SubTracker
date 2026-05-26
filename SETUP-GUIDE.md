# SubTracker — Setup & troubleshooting guide

## Current status (what works today)

| Component | URL / command | Status |
|-----------|----------------|--------|
| **Production API** | https://subtracker-1-tsuh.onrender.com/api/health | Working |
| **OTP email** | Signup on live API | Working (Brevo SMTP port 2525) |
| **Production frontend** | Your Amplify URL (e.g. `https://main.d6yni9me1rrqr.amplifyapp.com`) | Needs correct Amplify build + redeploy |
| **Local frontend** | `npm run dev` | Working (uses proxy to Render) |
| **Local backend** | `npm run dev:backend` | **Broken until you fix `MONGODB_URI`** |

---

## Step 1 — Run the app on your PC (easiest)

Open PowerShell:

```powershell
cd c:\Users\ankit\OneDrive\Desktop\SubTracker
npm run install:all
npm run dev
```

Open the URL Vite prints (e.g. http://localhost:5173).

- The UI talks to **Render** via a proxy (no local MongoDB needed).
- Config: `apps/frontend/.env.development.local` (already set).

**Test signup:** use a real email you can open → check inbox and **spam** for the 6-digit code.

**First API call after idle:** Render free tier may sleep 1–2 minutes. Open  
https://subtracker-1-tsuh.onrender.com/api/health  
in a tab, wait for `{"status":"ok"}`, then try signup again.

---

## Step 2 — Fix local backend (optional)

Your `apps/backend/.env` has an **outdated** MongoDB hostname (`subtracker.kdkcapg.mongodb.net` — DNS does not exist).

1. Go to https://cloud.mongodb.com  
2. Open your cluster → **Connect** → **Drivers**  
3. Copy the new connection string  
4. Replace `MONGODB_URI` in `apps/backend/.env`  
5. Run:

```powershell
npm run dev:full
```

If `mongodb+srv://` still fails on your network, use Atlas **“Standard connection string”** (not SRV).

---

## Step 3 — Production frontend (AWS Amplify)

### Amplify app settings

| Setting | Value |
|---------|--------|
| **Monorepo app root** | `apps/frontend` |
| **AMPLIFY_MONOREPO_APP_ROOT** | `apps/frontend` (Environment variables) |
| **Build spec** | Root `amplify.yml` (monorepo `applications` format) |
| **Branch** | `main` |

### Environment variable (build time)

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://subtracker-1-tsuh.onrender.com/api` |

`amplify.yml` already exports this during build; setting it in the Amplify console is a backup.

### Redeploy

After any env change: **Amplify → your app → Redeploy this version** (must rebuild — env vars are baked in at build time).

---

## Step 4 — Production backend (Render)

Dashboard: https://dashboard.render.com → service **subtracker-api**

### Required environment variables

| Variable | Example / notes |
|----------|------------------|
| `MONGODB_URI` | From Atlas (must be valid — same as you use in Atlas UI) |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `http://localhost:5173,https://main.d6yni9me1rrqr.amplifyapp.com` (no trailing `/`, comma-separated) |
| `EMAIL_HOST` | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Brevo SMTP login |
| `EMAIL_PASS` | Brevo **SMTP key** (`xsmtpsib-...`) |
| `EMAIL_FROM` | `SubTracker <ankityadavbkpur@gmail.com>` (verified in Brevo) |
| `GEMINI_API_KEY` | For YaarBot chat |
| `GEMINI_MODEL` | `gemini-2.5-flash` |

### Recommended (more reliable email)

| Variable | Notes |
|----------|--------|
| `BREVO_API_KEY` | API key from https://app.brevo.com/settings/keys/api (`xkeysib-...`, **not** SMTP key) |

Setup locally:

```powershell
cd apps\backend\scripts
.\install-brevo-key.ps1
```

Copy the same key to Render → Environment → **Manual Deploy**.

### Verify

```text
https://subtracker-1-tsuh.onrender.com/api/health
https://subtracker-1-tsuh.onrender.com/api/health/email
```

---

## Step 5 — Quick health checks

Run in PowerShell:

```powershell
# API up?
curl.exe -s https://subtracker-1-tsuh.onrender.com/api/health

# Email configured?
curl.exe -s https://subtracker-1-tsuh.onrender.com/api/health/email

# Local dev proxy (with npm run dev running)
curl.exe -s http://localhost:5173/api/health
```

---

## Common problems

### “App crashed” when running `npm run dev:full`

**Cause:** Local MongoDB URI is wrong → backend exits.  
**Fix:** Use `npm run dev` only, or update `MONGODB_URI` (Step 2).

### “Cannot reach the API” / Network Error

**Cause:** CORS or Render asleep, or wrong `VITE_API_URL` in Amplify build.  
**Fix:** Use `npm run dev` locally (proxy). On Amplify: set `VITE_API_URL` and redeploy. Wake Render via `/api/health`.

### OTP not received

1. Check **spam**  
2. Brevo sender `ankityadavbkpur@gmail.com` must be **verified** in Brevo → Senders  
3. Render logs: Dashboard → Logs → search `[email]` or `[signup/send-otp]`

### Signup works on localhost but not Amplify

1. `CLIENT_URL` on Render must include your **exact** Amplify URL  
2. Amplify must be rebuilt with `VITE_API_URL=https://subtracker-1-tsuh.onrender.com/api`

---

## Deploy order (when changing config)

1. **MongoDB Atlas** — cluster running  
2. **Render** — env vars → Manual Deploy → wait until Live  
3. **Amplify** — `VITE_API_URL` + redeploy frontend  
4. **Render again** — set `CLIENT_URL` to final Amplify URL if it changed  

---

## Commands cheat sheet

| Goal | Command |
|------|---------|
| Install deps | `npm run install:all` |
| Dev (recommended) | `npm run dev` |
| Dev + local API | `npm run dev:full` |
| Build frontend | `npm run build` |
| Test email locally | `cd apps/backend && npm run diagnose:email -- you@email.com` |

---

## Security reminder

- Never commit `apps/backend/.env` (contains secrets).  
- Rotate MongoDB password, Brevo SMTP key, and Gemini key if they were shared or exposed.
