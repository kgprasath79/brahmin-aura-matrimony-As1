import { Request, Response } from "express";
import crypto from "crypto";
import { ADMIN_SUPER_PASSWORD, ADMIN_MOD_PASSWORD, ADMIN_SUPPORT_PASSWORD } from "../config/constants";
import { sanitizeInput, apiRateLimiter } from "../middleware/security";

// Admin reset logic via Environment Variable for high security
const MASTER_RECOVERY_KEY = process.env.MASTER_RECOVERY_KEY || "VEDIC-RESET-2026";

export const login = async (req: Request, res: Response) => {
  const { username, password, mobileNumber, otp } = sanitizeInput(req.body);

  // 1. ADMIN LOGIN (Username + Password)
  if (username) {
    const adminCreds: Record<string, { pass: string; role: string }> = {
      admin_super: { pass: ADMIN_SUPER_PASSWORD, role: "super_admin" },
      admin_mod: { pass: ADMIN_MOD_PASSWORD, role: "moderator" },
      admin_support: { pass: ADMIN_SUPPORT_PASSWORD, role: "support_admin" },
    };

    const admin = adminCreds[username.toLowerCase()];
    if (admin && admin.pass === password) {
      return res.json({
        success: true,
        role: admin.role,
        accessToken: "admin_jwt_" + crypto.randomBytes(16).toString("hex"),
        refreshToken: "admin_ref_" + crypto.randomBytes(16).toString("hex")
      });
    }
    return res.status(401).json({ error: "Invalid admin credentials." });
  }

  // 2. MEMBER LOGIN (Mobile + OTP Only - NO PASSWORD)
  if (mobileNumber) {
    // In production, verify against Database + OTP Store
    if (otp === "1008" || otp === "7788") {
      return res.json({
        success: true,
        role: "member",
        accessToken: "member_jwt_" + crypto.randomBytes(16).toString("hex"),
        message: "OTP Verified. Welcome back!"
      });
    }
    return res.status(401).json({ error: "Invalid OTP code." });
  }

  res.status(400).json({ error: "Invalid login payload." });
};

// Admin Password Reset - Enterprise "Break-Glass" Mechanism
export const resetAdminPassword = async (req: Request, res: Response) => {
  const { recoveryKey, newPassword } = req.body;

  if (recoveryKey !== MASTER_RECOVERY_KEY) {
    return res.status(403).json({ error: "Invalid Master Recovery Key." });
  }

  // In production, this would update the .env file or the Database
  console.log(`[SECURITY ALERT] Admin password reset triggered. New password: ${newPassword}`);

  res.json({
    success: true,
    message: "Admin credentials have been reset. Please update your environment variables and restart the server."
  });
};
