const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    nextBillingDate: { type: Date, required: true },
    notes: { type: String, default: "" },
    reminderSentAt: { type: Date, default: null },
    priceHistory: [
      {
        price: { type: Number, required: true },
        recordedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
