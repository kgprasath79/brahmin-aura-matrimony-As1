import express from "express";
import crypto from "crypto";
import ms from "ms";

// OWASP SECURITY HEADERS
export const securityHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* data:; img-src 'self' data: https://* referrer; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
  );
  next();
};

// SANITIZATION ENGINE
export function sanitizeInput(val: any): any {
  if (typeof val === "string") {
    return val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  }
  if (val && typeof val === "object") {
    const cleaned: any = {};
    for (const k in val) {
      cleaned[k] = sanitizeInput(val[k]);
    }
    return cleaned;
  }
  return val;
}

// ADVANCED RATE LIMITER & LOCKOUT ENGINE
interface LoginAttempt {
  attempts: number;
  lastAttempt: number;
  lockUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const globalRateLimits = new Map<string, { count: number; resetTime: number }>();

export const loginRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0];
  const identifier = req.body.username || req.body.mobileNumber || ip;
  const key = `login:${identifier}:${ip}`;
  const now = Date.now();

  // 1. IP-based Global Rate Limit (10 per minute)
  let ipLimit = globalRateLimits.get(ip);
  if (!ipLimit || now > ipLimit.resetTime) {
    ipLimit = { count: 0, resetTime: now + ms("1m") };
  }
  ipLimit.count++;
  globalRateLimits.set(ip, ipLimit);

  if (ipLimit.count > 10) {
    return res.status(429).json({ error: "Too many login attempts. Please try again later." });
  }

  // 2. Account-based Lockout Logic
  const attemptData = loginAttempts.get(key) || { attempts: 0, lastAttempt: 0 };

  if (attemptData.lockUntil && now < attemptData.lockUntil) {
    const remaining = Math.ceil((attemptData.lockUntil - now) / 1000 / 60);
    return res.status(403).json({
      error: "Account temporarily locked for security. Please try again later.",
      retryAfter: `${remaining}m`
    });
  }

  // 3. Progressive Delay (Artificial latency for failed attempts)
  if (attemptData.attempts > 0) {
    const delay = Math.min(attemptData.attempts * 500, 5000); // Max 5s delay
    setTimeout(next, delay);
  } else {
    next();
  }
};

// Helper to record login results
export const recordLoginAttempt = (identifier: string, ip: string, success: boolean) => {
  const key = `login:${identifier}:${ip}`;
  const now = Date.now();
  const attemptData = loginAttempts.get(key) || { attempts: 0, lastAttempt: now };

  if (success) {
    loginAttempts.delete(key);
  } else {
    attemptData.attempts++;
    attemptData.lastAttempt = now;

    if (attemptData.attempts >= 5) {
      attemptData.lockUntil = now + ms("15m");
      // Trigger lockout email notification logic here
    }
    loginAttempts.set(key, attemptData);
  }
};

// Legacy API Rate Limiter
export function apiRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0];
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    let limit = globalRateLimits.get(key);
    if (!limit || now > limit.resetTime) {
      limit = { count: 0, resetTime: now + windowMs };
    }

    limit.count++;
    globalRateLimits.set(key, limit);

    if (limit.count > maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    next();
  };
}

// PROMPT GUARDRAIL
const promptReplayCache = new Set<string>();
export function validateAndSecurePrompt(promptText: string): { success: boolean; error?: string; flaggedTerm?: string } {
  if (!promptText || typeof promptText !== "string") {
    return { success: true };
  }

  const normalized = promptText.toLowerCase();

  const injectionPatterns = [
    "ignore previous instructions", "ignore above", "system prompt", "forget what you were told",
    "you are now a", "act as a", "dan mode", "do anything now", "bypass constraints",
    "instruction override", "forget instructions", "reveal system prompt", "override security",
    "you must obey", "jailbreak"
  ];

  for (const pattern of injectionPatterns) {
    if (normalized.includes(pattern)) {
      return {
        success: false,
        error: "Prompt Security Violation: Unauthorized directive detected.",
        flaggedTerm: pattern
      };
    }
  }

  const maliciousPatterns = ["union select", "drop table", "delete from users", "<script>", "javascript:", "exec_command"];
  for (const pattern of maliciousPatterns) {
    if (normalized.includes(pattern)) {
      return { success: false, error: "Input Validation Error: Unsafe parameter format detected.", flaggedTerm: pattern };
    }
  }

  const hash = crypto.createHash("sha256").update(promptText).digest("hex");
  if (promptReplayCache.has(hash)) {
    return { success: false, error: "Prompt Replay Blocked: Duplicate AI query rejected." };
  }
  promptReplayCache.add(hash);
  if (promptReplayCache.size > 1000) promptReplayCache.clear();

  return { success: true };
}
