import { Router } from "express";
import verifyUser from "../middlewares/verify.middleware";
const router = Router();

import resume from "../controllers/service/resume.creation";
router.post('/create',verifyUser,resume)


export default router;