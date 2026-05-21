const crypto = require("crypto");

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp).trim()).digest("hex");

const verifyOtp = (otp, hash) => hashOtp(otp) === hash;

module.exports = { generateOtp, hashOtp, verifyOtp };
