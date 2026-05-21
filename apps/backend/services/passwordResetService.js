const { getTransporter, sendMail } = require("./emailService");

const sendPasswordResetEmail = async ({ to, token, name }) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const link = `${clientUrl}/reset-password/${token}`;

  if (!getTransporter()) {
    console.log(`[DEV] Password reset link for ${to}: ${link}`);
    return;
  }

  await sendMail({
    to,
    subject: "SubTracker — Reset your password",
    text: `Hi ${name},\n\nReset your password: ${link}\n\nExpires in 1 hour.`,
    html: `<p>Hi <strong>${name}</strong>,</p><p><a href="${link}">Reset your password</a> (expires in 1 hour).</p>`,
  });
};

module.exports = { sendPasswordResetEmail };
