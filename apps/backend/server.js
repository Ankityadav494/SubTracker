// Env vars: Render dashboard in production; .env locally via `npm run dev`
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const subscriptionRoutes = require("./routes/subscriptions");
const analyticsRoutes = require("./routes/analytics");
const remindersRoutes = require("./routes/reminders");
const usersRoutes = require("./routes/users");
const householdRoutes = require("./routes/household");

const chatRoutes = require("./routes/chat");
const { startReminderCron } = require("./jobs/reminderJob");

const app = express();
const PORT = process.env.PORT || 5000;

const normalizeOrigin = (url) => url?.trim().replace(/\/$/, "") || "";

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => normalizeOrigin(o))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const normalized = normalizeOrigin(origin);
      if (!origin || allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      console.warn("[cors] Blocked origin:", origin, "allowed:", allowedOrigins);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    console.warn("[api] Invalid JSON body on", req.method, req.path);
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  next(err);
});

const healthPayload = () => ({
  status: "ok",
  service: "subtracker-api",
});

app.get("/api/health/email", async (_req, res) => {
  const { getEmailStatus, verifyEmailConfig } = require("./services/emailService");
  const status = getEmailStatus();
  const verified = await verifyEmailConfig();
  res.json({
    ...status,
    ok: status.ok && verified.ok,
    verified: verified.ok,
    via: verified.via,
    error: verified.ok ? undefined : verified.error,
  });
});

app.get("/api/health", (_req, res) => res.json(healthPayload()));
app.get("/health", (_req, res) => res.json(healthPayload()));
app.get("/", (_req, res) =>
  res.json({
    ...healthPayload(),
    message: "SubTracker API — use /api/* routes",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/household", householdRoutes);

app.use((err, req, res, _next) => {
  if (err.message?.includes("CORS")) {
    return res.status(403).json({ message: "Not allowed by CORS" });
  }
  console.error("[api]", req.method, req.path, err.message);
  res.status(500).json({ message: "Server error" });
});

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT_SECRET is required. Copy backend/.env.example to backend/.env"
    );
    process.exit(1);
  }

  await connectDB();
  startReminderCron();

  const { getEmailStatus, verifyEmailConfig } = require("./services/emailService");
  const emailStatus = getEmailStatus();
  verifyEmailConfig().then((r) => {
    if (r.ok) {
      console.log(`Email ready (${r.via})`);
      return;
    }
    console.error("[email] Not ready:", r.error || emailStatus.hint || "not configured");
    if (emailStatus.cloudHost && emailStatus.mode === "none") {
      console.error(
        "[email] OTP signup will FAIL until BREVO_API_KEY is set on Render → https://app.brevo.com/settings/keys/api"
      );
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
