import { Router } from "express";
import auth from "../controllers/auth/Auth";
const router = Router();

router.post('/',auth)
export default router;
