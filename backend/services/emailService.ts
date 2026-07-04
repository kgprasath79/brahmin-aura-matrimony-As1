import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLockoutEmail = async (email: string, resetLink: string) => {
  try {
    await transporter.sendMail({
      from: '"Heritage Matrimony Security" <security@heritagematrimony.com>',
      to: email,
      subject: "Security Alert: Account Locked",
      text: `Your account has been temporarily locked due to multiple failed login attempts. Use this link to reset your credentials: ${resetLink}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Security Alert</h2>
          <p>Your account has been temporarily locked for 15 minutes due to 5 consecutive failed login attempts.</p>
          <p>If this was not you, please secure your account immediately.</p>
          <a href="${resetLink}" style="background: #b45309; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Credentials</a>
        </div>
      `,
    });
    console.log(`Lockout email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send lockout email:", error);
  }
};
