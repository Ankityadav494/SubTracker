const express = require("express");
const Household = require("../models/Household");
const HouseholdInvite = require("../models/HouseholdInvite");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { sendInviteEmail } = require("../services/inviteEmailService");

const router = express.Router();
router.use(protect);

// GET /api/household
router.get("/", async (req, res) => {
  try {
    if (!req.user.household) {
      return res.json({ household: null });
    }

    const household = await Household.findById(req.user.household)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({ household });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/household
router.post("/", async (req, res) => {
  try {
    if (req.user.household) {
      return res.status(400).json({ message: "Already in a household" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Household name required" });
    }

    const household = await Household.create({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, { household: household._id });
    const populated = await Household.findById(household._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json({ household: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/household/invite
router.post("/invite", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const household = await Household.findById(req.user.household);
    if (!household || household.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the household owner can invite" });
    }

    const token = HouseholdInvite.generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await HouseholdInvite.create({
      household: household._id,
      email: email.toLowerCase(),
      token,
      invitedBy: req.user._id,
      expiresAt,
    });

    await sendInviteEmail({
      to: email,
      householdName: household.name,
      token,
      inviterName: req.user.name,
    });

    res.status(201).json({
      message: "Invite sent",
      invite: { email: invite.email, expiresAt: invite.expiresAt },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/household/accept/:token
router.post("/accept/:token", async (req, res) => {
  try {
    const invite = await HouseholdInvite.findOne({
      token: req.params.token,
      status: "pending",
    });

    if (!invite || invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    if (invite.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "Invite was sent to a different email" });
    }

    const household = await Household.findById(invite.household);
    if (!household.members.includes(req.user._id)) {
      household.members.push(req.user._id);
      await household.save();
    }

    await User.findByIdAndUpdate(req.user._id, { household: household._id });
    invite.status = "accepted";
    await invite.save();

    const populated = await Household.findById(household._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({ household: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
