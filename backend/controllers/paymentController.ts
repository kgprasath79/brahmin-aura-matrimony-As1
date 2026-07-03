import { Request, Response } from "express";
import { sanitizeInput } from "../middleware/security";
import { verifyWebhookSignature } from "../services/paymentService";

export const createCheckoutSession = async (req: any, res: Response) => {
  const { planName, price, idempotencyKey } = sanitizeInput(req.body);
  res.json({ success: true, message: "Session created.", txnId: "TXN-" + Date.now() });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const rawPayload = JSON.stringify(req.body);

  if (!verifyWebhookSignature(rawPayload, signature)) {
    return res.status(403).json({ error: "Invalid signature." });
  }

  res.json({ success: true });
};
