import { Router } from "express";
import astrologyRoutes from "./astrology";
import verificationRoutes from "./verification";
import paymentRoutes from "./payments";
import authRoutes from "./auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/horoscope", astrologyRoutes);
router.use("/verify", verificationRoutes);
router.use("/payments", paymentRoutes);

export default router;
