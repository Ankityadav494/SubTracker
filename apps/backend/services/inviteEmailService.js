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

const sendInviteEmail = async ({ to, householdName, token, inviterName }) => {
  const transport = getTransporter();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const link = `${clientUrl}/household/accept/${token}`;

  if (!transport) {
    console.log(`Household invite link for ${to}: ${link}`);
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Join ${householdName} on SubTracker`,
    text: `${inviterName} invited you to join "${householdName}". Accept: ${link}`,
    html: `<p><strong>${inviterName}</strong> invited you to join <strong>${householdName}</strong> on SubTracker.</p><p><a href="${link}">Accept invite</a></p>`,
  });
};

module.exports = { sendInviteEmail };
