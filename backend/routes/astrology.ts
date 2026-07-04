import { Router } from "express";
import { matchHoroscope, calculateHoroscope } from "../controllers/astrologyController";
import { apiRateLimiter } from "../middleware/security";

const router = Router();

router.post("/match", apiRateLimiter(20, 60000), matchHoroscope);
router.post("/calculate-horoscope", apiRateLimiter(60, 60000), calculateHoroscope);

export default router;
