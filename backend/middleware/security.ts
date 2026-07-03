import express from "express";
import crypto from "crypto";

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

// RATE LIMITER
const rateLimits = new Map<string, { count: number; resetTime: number }>();
export function apiRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0];
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    let limit = rateLimits.get(key);
    if (!limit || now > limit.resetTime) {
      limit = { count: 0, resetTime: now + windowMs };
    }

    limit.count++;
    rateLimits.set(key, limit);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - limit.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(limit.resetTime / 1000));

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
