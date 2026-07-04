import { Router } from "express";
import astrologyRoutes from "./astrology";
import verificationRoutes from "./verification";
import paymentRoutes from "./payments";
import authRoutes from "./auth";
import webhookRoutes from "./webhooks";

import { requireAuth } from "../middleware/authProvider";

const router = Router();

router.use("/auth", authRoutes);
router.use("/webhooks", webhookRoutes);

// Protected Enterprise Routes
router.use("/horoscope", requireAuth, astrologyRoutes);
router.use("/verify", requireAuth, verificationRoutes);
router.use("/payments", requireAuth, paymentRoutes);

export default router;
