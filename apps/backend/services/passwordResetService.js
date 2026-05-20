const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return transporter;
};

const sendPasswordResetEmail = async ({ to, token, name }) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const link = `${clientUrl}/reset-password/${token}`;
  const transport = getTransporter();

  if (!transport) {
    console.log(`Password reset link for ${to}: ${link}`);
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "SubTracker — Reset your password",
    text: `Hi ${name},\n\nReset your password: ${link}\n\nExpires in 1 hour.`,
    html: `<p>Hi <strong>${name}</strong>,</p><p><a href="${link}">Reset your password</a> (expires in 1 hour).</p>`,
  });
};

module.exports = { sendPasswordResetEmail };
