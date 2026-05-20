const mongoose = require("mongoose");
const crypto = require("crypto");

const householdInviteSchema = new mongoose.Schema(
  {
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    token: { type: String, required: true },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

householdInviteSchema.statics.generateToken = () =>
  crypto.randomBytes(24).toString("hex");

module.exports = mongoose.model("HouseholdInvite", householdInviteSchema);
