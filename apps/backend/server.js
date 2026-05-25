require("dotenv").config();

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

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const healthPayload = () => ({
  status: "ok",
  service: "subtracker-api",
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

app.use((err, _req, res, _next) => {
  console.error(err);
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

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
