const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const PendingSignup = require("../models/PendingSignup");
const { protect } = require("../middleware/auth");
const { sendPasswordResetEmail } = require("../services/passwordResetService");
const { sendSignupOtp } = require("../services/emailService");
const { generateOtp, hashOtp, verifyOtp } = require("../utils/otp");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  monthlyBudget: user.monthlyBudget,
  reminderDaysBefore: user.reminderDaysBefore,
  emailRemindersEnabled: user.emailRemindersEnabled,
  household: user.household,
});

const OTP_EXPIRE_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

// POST /api/auth/signup/send-otp
router.post("/signup/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpire = new Date(Date.now() + OTP_EXPIRE_MS);

    await PendingSignup.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: name.trim(),
        email: normalizedEmail,
        password,
        otpHash,
        otpExpire,
        otpAttempts: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendSignupOtp({ to: normalizedEmail, name: name.trim(), otp });

    res.json({
      message: "Verification code sent to your email",
      email: normalizedEmail,
      expiresInMinutes: 10,
    });
  } catch (err) {
    console.error("[signup/send-otp]", err.message);
    if (err.code === "EMAIL_NOT_CONFIGURED") {
      return res.status(503).json({
        message: "Email is not configured on the server. Add EMAIL_* or BREVO_API_KEY on Render.",
      });
    }
    if (err.code === "BREVO_IP_BLOCKED") {
      return res.status(503).json({
        message:
          "Brevo blocked this server's IP. In Brevo → Security → Authorized IPs, turn off SMTP/API IP blocking, or add BREVO_API_KEY on Render.",
      });
    }
    res.status(500).json({ message: "Could not send verification code" });
  }
});

// POST /api/auth/signup/resend-otp
router.post("/signup/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const pending = await PendingSignup.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!pending) {
      return res
        .status(400)
        .json({ message: "No pending signup — register again" });
    }

    const otp = generateOtp();
    pending.otpHash = hashOtp(otp);
    pending.otpExpire = new Date(Date.now() + OTP_EXPIRE_MS);
    pending.otpAttempts = 0;
    await pending.save();

    await sendSignupOtp({ to: pending.email, name: pending.name, otp });

    res.json({ message: "New verification code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not resend code" });
  }
});

// POST /api/auth/signup/verify-otp
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const pending = await PendingSignup.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!pending) {
      return res.status(400).json({ message: "Signup expired — please start again" });
    }

    if (pending.otpExpire < new Date()) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: "OTP expired — request a new code" });
    }

    if (pending.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res
        .status(429)
        .json({ message: "Too many attempts — request a new code" });
    }

    if (!verifyOtp(otp, pending.otpHash)) {
      pending.otpAttempts += 1;
      await pending.save();
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
    });

    await PendingSignup.deleteOne({ _id: pending._id });

    res.status(201).json({
      message: "Account verified",
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Verification failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: "Google OAuth not configured" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email }],
    });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    res.json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google sign-in failed" });
  }
});

// POST /api/auth/github
router.post("/github", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "GitHub code required" });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(503).json({ message: "GitHub OAuth not configured" });
    }

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(401).json({ message: "GitHub auth failed" });
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });
    const ghUser = await userRes.json();

    let email = ghUser.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      });
      const emails = await emailRes.json();
      const primary = emails.find((e) => e.primary) || emails[0];
      email = primary?.email;
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "GitHub account has no public email" });
    }

    let user = await User.findOne({
      $or: [{ githubId: String(ghUser.id) }, { email }],
    });

    if (!user) {
      user = await User.create({
        name: ghUser.name || ghUser.login,
        email,
        githubId: String(ghUser.id),
      });
    } else if (!user.githubId) {
      user.githubId = String(ghUser.id);
      await user.save();
    }

    res.json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "GitHub sign-in failed" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link was sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail({ to: user.email, token: resetToken, name: user.name });

    res.json({ message: "If that email exists, a reset link was sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json(formatUser(req.user));
});

module.exports = router;
