const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const formatSettings = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  monthlyBudget: user.monthlyBudget,
  reminderDaysBefore: user.reminderDaysBefore,
  emailRemindersEnabled: user.emailRemindersEnabled,
  household: user.household,
});

// GET /api/users/settings
router.get("/settings", async (req, res) => {
  res.json(formatSettings(req.user));
});

// PUT /api/users/settings
router.put("/settings", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, monthlyBudget, reminderDaysBefore, emailRemindersEnabled } =
      req.body;

    if (name) user.name = name;
    if (monthlyBudget !== undefined) {
      user.monthlyBudget = monthlyBudget === null ? null : Number(monthlyBudget);
    }
    if (reminderDaysBefore !== undefined) {
      user.reminderDaysBefore = Number(reminderDaysBefore);
    }
    if (emailRemindersEnabled !== undefined) {
      user.emailRemindersEnabled = Boolean(emailRemindersEnabled);
    }

    await user.save();
    res.json(formatSettings(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/password
router.put("/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.password) {
      return res
        .status(400)
        .json({ message: "OAuth accounts cannot change password here" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is wrong" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
