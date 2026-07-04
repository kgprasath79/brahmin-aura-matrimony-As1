import crypto from "crypto";
import { PAYMENT_WEBHOOK_SECRET } from "../config/constants";

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!signature) return false;
  try {
    const computedSig = crypto
      .createHmac("sha256", PAYMENT_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    const bufComputed = Buffer.from(computedSig);
    const bufSignature = Buffer.from(signature);

    if (bufComputed.length !== bufSignature.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufComputed, bufSignature);
  } catch (err) {
    return false;
  }
}
