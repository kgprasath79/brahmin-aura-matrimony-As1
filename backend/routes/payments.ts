import { Router } from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/paymentController";
import { apiRateLimiter } from "../middleware/security";

const router = Router();

router.post("/checkout-session", apiRateLimiter(30, 60000), createCheckoutSession);
router.post("/webhook", handleWebhook);

export default router;
