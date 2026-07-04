import { Request, Response, NextFunction } from "express";

/**
 * Enterprise Auth Provider Middleware
 * Integrates with external SDKs (Clerk / Supabase / Auth0)
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // In a real implementation:
  // const { userId } = getAuth(req);
  // if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For development, we might allow a mock bypass if configured
    if (process.env.NODE_ENV === "development" && req.headers["x-mock-user"]) {
      (req as any).auth = { userId: req.headers["x-mock-user"] };
      return next();
    }
    return res.status(401).json({ error: "Authentication required via Provider SDK." });
  }

  // Token Verification Logic (e.g., JWT verify against Provider Public Key)
  try {
    // Mock successful verification
    (req as any).auth = { userId: "user_mock_12345" };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired provider session." });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).auth;
  // In production, fetch role from our local metadata DB using userId
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
};
