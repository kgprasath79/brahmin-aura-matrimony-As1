import { Router } from "express";
import { login, resetAdminPassword } from "../controllers/authController";
import { apiRateLimiter } from "../middleware/security";

const router = Router();

router.post("/login", apiRateLimiter(10, 60000), login);
router.post("/admin-reset", apiRateLimiter(3, 3600000), resetAdminPassword); // Only 3 attempts per hour

export default router;
