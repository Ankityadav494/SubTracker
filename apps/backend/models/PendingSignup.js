const mongoose = require("mongoose");

const pendingSignupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    otpHash: { type: String, required: true },
    otpExpire: { type: Date, required: true },
    otpAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pendingSignupSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
