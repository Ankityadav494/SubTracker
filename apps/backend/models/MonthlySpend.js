const mongoose = require("mongoose");

const monthlySpendSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalMonthly: { type: Number, default: 0 },
    subscriptionCount: { type: Number, default: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

monthlySpendSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlySpend", monthlySpendSchema);
