import { Request, Response } from "express";
import crypto from "crypto";
import { sanitizeInput, validateAndSecurePrompt } from "../middleware/security";
import ai from "../config/ai";
import { Type } from "@google/genai";

export const scanProfile = async (req: Request, res: Response) => {
  const sanitized = sanitizeInput(req.body);
  const { name, bio, email, imageUrl } = sanitized;

  const promptSecurity = validateAndSecurePrompt(JSON.stringify(sanitized));
  if (!promptSecurity.success) return res.status(400).json({ error: promptSecurity.error });

  let riskScore = 5;
  const flags = [];

  // Logic from server.ts (simplified)
  if (email?.includes("tempmail.com")) {
    riskScore += 40;
    flags.push("Disposable Email");
  }

  if (ai && bio) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: `Analyze bio for fraud: ${bio}` }] }]
      });
      // AI processing here...
    } catch (err) { /* silent fail */ }
  }

  res.json({
    success: true,
    metrics: {
      riskScore: Math.min(riskScore, 100),
      threatCategory: riskScore > 40 ? "HIGH" : "LOW"
    },
    flags
  });
};
