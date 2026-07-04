import { Router } from "express";
import { login, resetAdminPassword } from "../controllers/authController";
import { apiRateLimiter, loginRateLimiter } from "../middleware/security";

const router = Router();

router.post("/login", loginRateLimiter, login);
router.post("/admin-reset", apiRateLimiter(3, 3600000), resetAdminPassword);

export default router;
