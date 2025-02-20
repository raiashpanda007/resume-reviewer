import { Router } from "express";
import verifyUser from "../middlewares/verify.middleware";
const router = Router();

import resumeCreate from "../controllers/service/resume.creation";
router.post('/create',verifyUser,resumeCreate)


export default router;