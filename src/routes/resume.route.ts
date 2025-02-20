import { Router } from "express";
import verifyUser from "../middlewares/verify.middleware";
const router = Router();

import resumeCreate from "../controllers/service/resume.creation";
import searchResume from "../controllers/service/resume.search";
router.post('/create',verifyUser,resumeCreate)
router.get('/search',verifyUser,searchResume)


export default router;