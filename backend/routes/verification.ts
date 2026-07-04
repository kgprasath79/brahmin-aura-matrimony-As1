import { Router } from "express";
import { sendOTP, verifyOTP, registerVerify } from "../controllers/verificationController";
import { apiRateLimiter } from "../middleware/security";

const router = Router();

// High security: limit OTP requests to 3 per minute
router.post("/send-otp", apiRateLimiter(3, 60000), sendOTP);
router.post("/verify-otp", apiRateLimiter(5, 60000), verifyOTP);
router.post("/", apiRateLimiter(10, 60000), registerVerify);

export default router;
